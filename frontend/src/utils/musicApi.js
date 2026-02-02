import axios from 'axios';

// 自动判断环境
// 开发环境(Dev): 使用 Vite 代理 (/netease -> localhost:3002)
// 生产环境(Prod): 使用 Nginx 转发 (http://你的IP/netease -> localhost:3002)
const NETEASE_BASE = '/netease'; 
const QQ_BASE = '/qqmusic';

// ==========================================
// 通用工具函数
// ==========================================

// 1. QQ音乐封面拼接工具
const getQQCover = (albummid) => {
  if (!albummid) return "https://y.gtimg.cn/mediastyle/global/img/album_300.png";
  return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`;
};

// 2. 网易云备用链接生成 (当 API 拿不到 URL 时尝试这个)
const getNeteaseFallbackUrl = (id) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};

// ==========================================
// 网易云音乐逻辑
// ==========================================

export const fetchNeteasePlaylist = async (playlistId, limit = 50) => {
  try {
    // 1. 获取歌单详情
    const res = await axios.get(`${NETEASE_BASE}/playlist/detail?id=${playlistId}`);
    const trackIds = res?.data?.playlist?.trackIds?.map(t => t.id) || [];
    
    // 限制数量，防止请求超时
    const limitedIds = trackIds.slice(0, limit);
    if (limitedIds.length === 0) return [];

    const idsStr = limitedIds.join(',');

    // 2. 获取歌曲详情 (为了拿封面、歌手名)
    const detailsRes = await axios.get(`${NETEASE_BASE}/song/detail?ids=${idsStr}`);
    const songs = detailsRes?.data?.songs || [];

    // 3. 获取播放链接
    // 尝试两个接口，因为不同版本的 API 可能参数不同
    let urlList = [];
    try {
      const urlRes = await axios.get(`${NETEASE_BASE}/song/url?id=${idsStr}`);
      urlList = urlRes.data.data || [];
    } catch (e) {
      console.warn("Netease song/url failed", e);
    }

    // 建立 ID -> URL 映射
    const urlMap = {};
    urlList.forEach(item => {
      // 兼容不同 API 版本的返回字段 (id 或 songId)
      const id = item.id || item.songId; 
      urlMap[id] = item.url;
    });

    // 4. 组装数据
    const playlist = songs.map(song => {
      const apiSrc = urlMap[song.id];
      // 如果 API 没返回链接 (比如未登录时的VIP歌)，使用官方外链尝试兜底
      const finalSrc = apiSrc || getNeteaseFallbackUrl(song.id);

      return {
        id: song.id,
        title: song.name,
        artist: (song.ar || []).map(a => a.name).join('/'),
        cover: song.al?.picUrl || '',
        src: finalSrc, 
        lrc: '', // 歌词延迟获取
        platform: 'netease' // 重要：标记来源
      };
    });

    return playlist;
  } catch (error) {
    console.error('fetchNeteasePlaylist error', error);
    return [];
  }
};

export const fetchNeteaseLyric = async (songId) => {
  try {
    const res = await axios.get(`${NETEASE_BASE}/lyric?id=${songId}`);
    return res?.data?.lrc?.lyric || "[00:00.00] 纯音乐或无歌词";
  } catch (error) {
    return "[00:00.00] 歌词获取失败";
  }
};

// 获取单首网易云歌曲的播放链接（用于刷新过期链接）
export const fetchNeteaseSongUrl = async (songId) => {
  try {
    const res = await axios.get(`${NETEASE_BASE}/song/url?id=${songId}`);
    const urlData = res?.data?.data?.[0];
    return urlData?.url || getNeteaseFallbackUrl(songId);
  } catch (error) {
    console.warn('fetchNeteaseSongUrl failed', error);
    return getNeteaseFallbackUrl(songId);
  }
};

// ==========================================
// QQ 音乐逻辑 (重写版)
// ==========================================

// 注意：QQ音乐 rain120 API 很难获取“用户歌单”，通常建议使用“搜索”功能
// 这里提供一个搜索函数，这是目前最稳的获取 QQ 歌曲的方式
export const searchQQMusic = async (keyword) => {
  try {
    const res = await axios.get(`${QQ_BASE}/search?key=${encodeURIComponent(keyword)}&pageSize=10`);
    const list = res.data?.data?.list || [];

    return list.map(item => ({
      id: item.songmid, // QQ 必须用 songmid
      title: item.songname,
      artist: (item.singer || []).map(s => s.name).join('/'),
      cover: getQQCover(item.albummid), // 手动拼接封面
      src: '', // QQ 链接有时效性，不能这里获取，必须播放时实时获取
      lrc: '',
      platform: 'qq' // 标记来源
    }));
  } catch (error) {
    console.error('searchQQMusic error', error);
    return [];
  }
};

// 获取 QQ 播放链接 (必须实时调用)
export const fetchQQPlayUrl = async (songmid) => {
  try {
    // rain120 API 接口：/song/urls?id=xxx
    const res = await axios.get(`${QQ_BASE}/song/urls?id=${songmid}`);
    // 返回结构通常是 { data: { "songmid": "url" } }
    const urls = res.data?.data || {};
    return urls[songmid] || "";
  } catch (error) {
    console.error('fetchQQPlayUrl error', error);
    return "";
  }
};

// 获取 QQ 歌词
export const fetchQQLyric = async (songmid) => {
  try {
    const res = await axios.get(`${QQ_BASE}/lyric?songmid=${songmid}`);
    return res?.data?.data?.lyric || "[00:00.00] 纯音乐或无歌词";
  } catch (e) {
    return "[00:00.00] 歌词获取失败";
  }
};