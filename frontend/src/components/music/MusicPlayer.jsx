import React, { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, ListMusic, 
  X, Volume2, VolumeX, Volume1 
} from "lucide-react";
import { parseLrc } from "./lrc";
import { fetchQQPlayUrl, fetchQQLyric, fetchNeteaseLyric, fetchNeteaseSongUrl } from '../../utils/musicApi';
import { DEFAULT_PLAYLIST } from "./playlist"; 

const MusicPlayer = ({ playlist = [], primaryColor = "#000000" }) => {
  // === 1. 歌单初始化 ===
  const activePlaylist = (playlist && playlist.length > 0) ? playlist : DEFAULT_PLAYLIST;

  // === 2. 状态管理 ===
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 真实资源
  const [realSrc, setRealSrc] = useState("");
  const [realLrc, setRealLrc] = useState("");

  // UI 状态
  const [progress, setProgress] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false); // 控制左右切换
  const [lyricsLines, setLyricsLines] = useState([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [volume, setVolume] = useState(0.5); 
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  
  const currentSong = activePlaylist[currentIndex] || {};

  // === 3. 资源加载 ===
  useEffect(() => {
    if (!currentSong.id) return;

    let isMounted = true;
    setLoadError(false);
    
    // 切换歌曲时：立即重置状态
    setLyricsLines([]); 
    setRealLrc(""); 
    
    const fallbackUrl = `https://music.163.com/song/media/outer/url?id=${currentSong.id}.mp3`;
    
    // QQ 音乐：使用现有 src 或为空（后续异步获取）
    if (currentSong.platform === 'qq') {
       setRealSrc(currentSong.src || ""); 
    } else {
       // 网易云：先设置为空，强制异步刷新（避免使用过期链接）
       setRealSrc("");
    }
    
    if (currentSong.lrc) {
      setRealLrc(currentSong.lrc);
    }

    const loadResources = async () => {
      // QQ 音乐：需要实时获取播放链接
      if (currentSong.platform === 'qq' && !currentSong.src) {
        try {
          const url = await fetchQQPlayUrl(currentSong.id);
          if (isMounted && url) setRealSrc(url);
        } catch (e) { console.error(e); }
      }

      // 网易云：主动刷新播放链接（解决过期问题）
      if (currentSong.platform === 'netease') {
        try {
          const freshUrl = await fetchNeteaseSongUrl(currentSong.id);
          if (isMounted && freshUrl) {
            setRealSrc(freshUrl);
          }
        } catch (e) {
          console.warn('Refresh Netease URL failed', e);
          if (isMounted) setRealSrc(fallbackUrl);
        }
      }

      // 歌词加载
      if (!currentSong.lrc) {
        try {
          let lrcText = "";
          if (currentSong.platform === 'qq') {
            lrcText = await fetchQQLyric(currentSong.id);
          } else {
            lrcText = await fetchNeteaseLyric(currentSong.id);
          }
          if (isMounted && lrcText) {
            setRealLrc(lrcText);
          }
        } catch (e) { console.warn(e); }
      }
    };

    loadResources();

    return () => { isMounted = false; };
  }, [currentSong.id, currentSong.platform, currentSong.src, currentSong.lrc]);


  // === 4. 解析歌词 ===
  useEffect(() => {
    if (realLrc) {
      const lines = parseLrc(realLrc);
      setLyricsLines(lines);
    }
    setActiveLyricIndex(0);
  }, [realLrc]);


  // === 5. 播放控制 ===
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.warn("Play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const changeSong = (direction) => {
    const len = activePlaylist.length;
    let nextIndex = 0;
    if (direction === 'next') nextIndex = (currentIndex + 1) % len;
    else nextIndex = (currentIndex - 1 + len) % len;
    
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  const handleAudioError = () => {
    if (!realSrc) return;
    setLoadError(true);
    if (activePlaylist.length > 1 && isPlaying) {
      setTimeout(() => changeSong('next'), 2000);
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current && realSrc) {
      const timer = setTimeout(() => {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [realSrc, currentIndex]);


  // === 6. 进度与歌词滚动 ===
  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || isDragging) return;

    const current = audio.currentTime;
    const duration = audio.duration || 1;
    setProgress((current / duration) * 100);

    if (lyricsLines.length > 0) {
      let idx = -1;
      for (let i = 0; i < lyricsLines.length; i++) {
        if (lyricsLines[i].time > current) break;
        idx = i;
      }
      if (idx !== -1 && idx !== activeLyricIndex) {
        setActiveLyricIndex(idx);
      }
    }
  };

  const handleSeek = (e) => setProgress(parseFloat(e.target.value));
  const handleSeekEnd = (e) => {
    setIsDragging(false);
    if (audioRef.current) {
      const val = parseFloat(e.target.value);
      audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
    }
  };

  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeEl = container.querySelector(`.lyric-active`);
      if (activeEl) {
        // Wait two frames so layout settles (images/fonts/etc.) before measuring
        const doScroll = () => {
          const inner = container.firstElementChild;
          // If content shorter than container, add vertical padding to center it
          if (inner) {
            const contentHeight = inner.scrollHeight;
            const containerHeight = container.clientHeight;
            if (contentHeight <= containerHeight) {
              const pad = Math.max(0, Math.floor((containerHeight - contentHeight) / 2));
              inner.style.paddingTop = pad + 'px';
              inner.style.paddingBottom = pad + 'px';
              // no scrolling needed
              return;
            } else {
              inner.style.paddingTop = '';
              inner.style.paddingBottom = '';
            }
          }

          // Use bounding rects for robust positioning across browsers
          const containerRect = container.getBoundingClientRect();
          const activeRect = activeEl.getBoundingClientRect();
          const elCenterOffset = (activeRect.top + activeRect.height / 2) - containerRect.top;
          const targetScroll = container.scrollTop + (elCenterOffset - (container.clientHeight / 2));
          const maxScroll = container.scrollHeight - container.clientHeight;
          const finalScroll = Math.max(0, Math.min(maxScroll, Math.round(targetScroll)));
          try {
            container.scrollTo({ top: finalScroll, behavior: 'smooth' });
          } catch (e) {
            container.scrollTop = finalScroll;
          }
        };
        requestAnimationFrame(() => requestAnimationFrame(doScroll));
      } else {
        // If no active element and content is short, ensure it's vertically centered by resetting scroll
        if (container.scrollHeight <= container.clientHeight) container.scrollTop = 0;
      }
    }
  }, [activeLyricIndex, showLyrics]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // 辅助样式
  const getRgba = (hex, alpha) => {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return `rgba(0,0,0,${alpha})`;
  };

  const bgStyle = { backgroundColor: getRgba(primaryColor, 0.25) };
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (!currentSong.id) return <div className="md:col-span-1 h-[280px] rounded-3xl border border-white/10 flex items-center justify-center text-gray-500">No Music</div>;

  return (
    <div 
      className="md:col-span-1 rounded-3xl border border-white/10 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group animate-fade-up flex flex-col h-[280px]"
      style={{ animationDelay: '0.7s', ...bgStyle }}
    >
      <audio
        ref={audioRef}
        src={realSrc}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => changeSong('next')}
        onError={handleAudioError}
        preload="auto"
      />

      {/* 背景光效 */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-full pointer-events-none opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* 顶部栏 */}
      <div className="flex items-center justify-between relative z-20 mb-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-[3px] items-end h-4">
             {[1, 2, 3].map(i => (
               <span key={i} className={`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 ${isPlaying ? 'animate-pulse h-3' : 'h-1 opacity-50'}`} style={{ animationDelay: `${i * 0.1}s` }}></span>
             ))}
          </div>
          <span className="text-[10px] font-bold text-[#ec4141] uppercase tracking-widest truncate max-w-[80px]">
            {loadError ? "Error" : isPlaying ? "Playing" : "Paused"}
          </span>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 group/vol">
                <input 
                    type="range" min="0" max="1" step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                    className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <button onClick={() => setIsMuted(!isMuted)} className="text-white/50 hover:text-white"><VolumeIcon size={16} /></button>
            </div>
            <button onClick={() => setShowLyrics(!showLyrics)} className={showLyrics ? 'text-white' : 'text-white/50 hover:text-white'}>
                {showLyrics ? <X size={18} /> : <ListMusic size={18} />}
            </button>
        </div>
      </div>

      {/* 
        中间区域：左右切换模式
        关键修复：
        1. 父容器设置 overflow-hidden 和 flex-1
        2. 子元素使用 absolute inset-0 撑满
        3. 封面：showLyrics=true 时 translateX(-100%) 到左边
        4. 歌词：showLyrics=false 时 translateX(100%) 到右边
        5. 这样两者永远不会重叠
      */}
      <div className="flex-1 relative w-full overflow-hidden mb-1 min-h-0">
        
        {/* 1. 封面视图 */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out
          ${showLyrics ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        >
          <div className="relative w-24 h-24 mb-2">
             <div className={`w-full h-full rounded-full border-[4px] border-black bg-black shadow-xl flex items-center justify-center ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                <img 
                  src={currentSong.cover || "/images/music_placeholder.png"} 
                  alt="Cover"
                  className="w-full h-full rounded-full object-cover opacity-90 border border-white/10"
                  onError={(e) => { e.target.src = "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg" }} 
                />
             </div>
          </div>
          <div className="text-center w-full px-2">
            <h3 className="text-sm font-bold text-white truncate">{currentSong.title || "Unknown"}</h3>
            <p className="text-xs text-gray-400 truncate mt-1">{currentSong.artist || "Unknown"}</p>
          </div>
        </div>

        {/* 2. 歌词视图 */}
        <div 
          className={`absolute inset-0 transition-transform duration-500 ease-in-out
          ${showLyrics ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        >
          <div 
              ref={lyricsContainerRef} 
              className="w-full h-full overflow-y-auto no-scrollbar text-center"
            >
              <div className="w-full" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {lyricsLines.length > 0 ? (
                  lyricsLines.map((line, i) => (
                    <p 
                      key={i} 
                      className={`text-xs py-2 transition-all duration-300 ${i === activeLyricIndex ? 'lyric-active text-[#ec4141] font-bold scale-110 blur-0' : 'text-gray-500 scale-100 blur-[0.5px]'}`}
                    >
                      {line.text}
                    </p>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-gray-500">{loadError ? "暂无歌词 / 加载失败" : "纯音乐 / 歌词加载中..."}</p>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* 底部控制栏 */}
      <div className="relative z-20 mt-auto flex-shrink-0">
        <div className="w-full h-3 flex items-center justify-center relative group/progress mb-1">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#ec4141] rounded-full relative" style={{ width: `${progress}%` }} />
            </div>
            <input 
                type="range" min="0" max="100" step="0.1" value={progress}
                onMouseDown={() => setIsDragging(true)} 
                onTouchStart={() => setIsDragging(true)}
                onChange={handleSeek} 
                onMouseUp={handleSeekEnd} 
                onTouchEnd={handleSeekEnd}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
        </div>
        <div className="flex items-center justify-between px-4 pb-1">
          <button onClick={() => changeSong('prev')} className="text-gray-400 hover:text-white p-2"><SkipBack size={20} /></button>
          <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#ec4141] text-white flex items-center justify-center transition-all border border-white/5 hover:scale-105 shadow-lg active:scale-95">
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={() => changeSong('next')} className="text-gray-400 hover:text-white p-2"><SkipForward size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;