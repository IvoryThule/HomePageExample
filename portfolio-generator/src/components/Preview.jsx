import React, { useState, useRef, useEffect } from "react";
import { 
  Github, Twitter, Globe, Linkedin, ArrowUpRight, 
  Play, Pause, SkipBack, SkipForward, ListMusic, X, Folder, Layout
} from "lucide-react";

// ==================== 图标映射 ====================
export const IconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  web: Globe,
};

// ==================== 1. 歌单数据整理 (已填入你提供的数据) ====================
// 注意：部分歌曲如果是VIP专享，网易云的外链接口会返回403或404，导致无法播放。
// 我添加了 onError 自动切歌逻辑来处理这种情况。
const DEFAULT_PLAYLIST = [
  {
    id: 2091770490,
    title: "心を刺す言葉だけ",
    artist: "MIMI / 初音ミク / 可不",
    cover: "https://p1.music.126.net/sqXOIOY78hwZHprUaVrWDg==/109951168990382920.jpg",
    // 示例：在这里粘贴 AI 帮你对齐的 LRC 内容
    lrc: `[00:00.00]作词 : MIMI
[00:01.00]作曲 : MIMI
[00:05.00]只有刺痛心灵的话语 (Instrumental)
[00:10.00]（此处为示例歌词，请粘贴完整LRC）
[00:15.00]Music playing...` 
  },
  {
    id: 3340137252,
    title: "纸飞机",
    artist: "鸣潮先约电台 / 飞行雪绒",
    cover: "https://p1.music.126.net/JP0G2ELXQGfeTvzEsOqeCw==/109951172603135736.jpg",
    lrc: ""
  },
  {
    id: 2146403327,
    title: "达道，东山",
    artist: "因你而在的梦",
    cover: "https://p1.music.126.net/Lsxwas9NJ4TCnyAcdS01jA==/109951169499871617.jpg",
    lrc: ""
  },
  {
    id: 2013750367,
    title: "新生",
    artist: "leomantic",
    cover: "https://p2.music.126.net/qnco-vO6kLkl2l6yp74GFQ==/109951168212021441.jpg",
    lrc: ""
  },
  {
    id: 1905096365,
    title: "嵌在晚霞中的橘",
    artist: "邹牧虞",
    cover: "https://p1.music.126.net/WUUBlyhAFUvFDJ4MJXIx6A==/109951166753692371.jpg",
    lrc: ""
  },
  {
    id: 2141151463,
    title: "泥潭",
    artist: "王子健",
    cover: "https://p2.music.126.net/pJDsdlLiG6eOsv100nbs_g==/109951169458351646.jpg",
    lrc: ""
  },
  {
    id: 1879128089,
    title: "琥珀艾尔（Amber Ale）",
    artist: "灰澈",
    cover: "https://p1.music.126.net/uTDm4og_OErehDU5gh_NQg==/109951166427186614.jpg",
    lrc: ""
  },
  {
    id: 2667716747,
    title: "云海乐章",
    artist: "鸣潮先约电台 / jkinss",
    cover: "https://p1.music.126.net/8-AlS_ljHufHQ_J3LIo9vg==/109951170406599556.jpg",
    lrc: ""
  },
  {
    id: 1912152425,
    title: "等风来",
    artist: "Parion圆周率",
    cover: "https://p2.music.126.net/FNzch14tbbIHwHH4wlcW_A==/109951165411841248.jpg",
    lrc: ""
  },
  {
    id: 2676687608,
    title: "Daisy Crown",
    artist: "Empty old City",
    cover: "https://p2.music.126.net/J0ZfqWmqX3zGJLzTubJ7vg==/109951170498554226.jpg",
    lrc: ""
  },
  {
    id: 2667716744,
    title: "故风吟游之地",
    artist: "鸣潮先约电台",
    cover: "https://p1.music.126.net/8-AlS_ljHufHQ_J3LIo9vg==/109951170406599556.jpg",
    lrc: ""
  },
  {
    id: 2722447989,
    title: "致以无名的抗争者",
    artist: "鸣潮先约电台",
    cover: "https://p2.music.126.net/ThQj6h7-ZtSoeRRESBYa_A==/109951171402488996.jpg",
    lrc: ""
  },
  {
    id: 2111042517,
    title: "一日还",
    artist: "此间不语",
    cover: "https://p2.music.126.net/0acW73oztapT-SZl0RdSbg==/109951169200781159.jpg",
    lrc: ""
  }
];

// ==================== 辅助工具函数 ====================
const parseLrc = (lrcString) => {
  if (!lrcString) return [];
  const lines = lrcString.split("\n");
  const result = [];
  // 匹配 [mm:ss.xx] 或 [mm:ss.xxx]
  const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  
  lines.forEach((line) => {
    const match = timeExp.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3]);
      // 如果ms是两位数，通常代表1/100秒，如果是三位则是1/1000
      const msVal = match[3].length === 2 ? ms * 10 : ms; 
      const time = min * 60 + sec + msVal / 1000;
      const text = line.replace(timeExp, "").trim();
      if (text) result.push({ time, text });
    }
  });
  return result;
};

// 确保图片链接是 HTTPS，防止混合内容错误
const secureUrl = (url) => {
  if (!url) return "";
  return url.replace(/^http:\/\//i, 'https://');
};

// ==================== 播放器组件 ====================
const MusicPlayer = ({ playlist = DEFAULT_PLAYLIST, primaryColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsLines, setLyricsLines] = useState([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef(null);
  const currentSong = playlist[currentIndex];

  useEffect(() => {
    setLyricsLines(parseLrc(currentSong.lrc));
    setActiveLyricIndex(0);
    setLoadError(false); // 切歌时重置错误状态
  }, [currentIndex, currentSong]);

  const togglePlay = () => {
    if(!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Play interrupted or failed:", error);
          // 很多浏览器禁止自动播放，或者链接失效，这里不一定要设为false，但最好处理
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const next = (currentIndex + 1) % playlist.length;
    setCurrentIndex(next);
    setIsPlaying(true);
  };

  const playPrev = () => {
    const prev = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prev);
    setIsPlaying(true);
  };

  // 处理播放错误（如下架、VIP、403等）
  const handleAudioError = () => {
    console.warn(`Song ID ${currentSong.id} failed to load. Skipping...`);
    setLoadError(true);
    // 延迟一点切歌，避免无限快速循环死锁
    setTimeout(() => {
        playNext();
    }, 1000);
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const current = audio.currentTime;
      const duration = audio.duration || 1;
      setProgress((current / duration) * 100);

      if (showLyrics && lyricsLines.length > 0) {
        const index = lyricsLines.findIndex((line, i) => {
          const nextLine = lyricsLines[i + 1];
          return current >= line.time && (!nextLine || current < nextLine.time);
        });
        if (index !== -1) setActiveLyricIndex(index);
      }
    }
  };

  // 监听索引变化后自动播放
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // 加上简单的防抖或延迟
      const timer = setTimeout(() => {
         audioRef.current.play().catch(e => console.warn("Autoplay blocked", e));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]); // eslint-disable-line

  return (
    <div 
      className="md:col-span-1 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group animate-fade-up flex flex-col h-[280px]"
      style={{ animationDelay: '0.7s' }}
    >
      <audio
        ref={audioRef}
        // 使用 https 并确保外链格式正确
        src={`https://music.163.com/song/media/outer/url?id=${currentSong.id}.mp3`}
        onTimeUpdate={onTimeUpdate}
        onEnded={playNext}
        onError={handleAudioError}
        preload="auto"
      />

      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-full pointer-events-none opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* 顶部栏 */}
      <div className="flex items-center justify-between relative z-20 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-[3px] items-end h-4">
            <span className={`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 ${isPlaying ? 'animate-[music-bar_0.8s_ease-in-out_infinite]' : 'h-1 opacity-50'}`}></span>
            <span className={`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 delay-75 ${isPlaying ? 'animate-[music-bar_1.0s_ease-in-out_infinite]' : 'h-2 opacity-50'}`}></span>
            <span className={`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 delay-150 ${isPlaying ? 'animate-[music-bar_0.6s_ease-in-out_infinite]' : 'h-1 opacity-50'}`}></span>
          </div>
          <span className="text-[10px] font-bold text-[#ec4141] uppercase tracking-widest">
            {loadError ? "Load Failed..." : "Now Playing"}
          </span>
        </div>
        <button 
          onClick={() => setShowLyrics(!showLyrics)}
          className="text-white/50 hover:text-white transition-colors"
          title="Toggle Lyrics"
        >
          {showLyrics ? <X size={18} /> : <ListMusic size={18} />}
        </button>
      </div>

      {/* 封面与歌词区域 */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden mb-4">
        
        {/* 封面视图 */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 transform ${showLyrics ? 'opacity-0 scale-90 translate-y-4 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'}`}>
          <div className="relative w-28 h-28 mb-4">
             <div className={`w-full h-full rounded-full border-[6px] border-black bg-black shadow-xl flex items-center justify-center ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                <img 
                  src={secureUrl(currentSong.cover)} 
                  alt="Cover" 
                  className="w-full h-full rounded-full object-cover opacity-90 border border-white/10" 
                />
                <div className="absolute w-3 h-3 bg-[#1a1a1a] rounded-full border border-white/20 z-10" />
             </div>
          </div>
          <div className="text-center w-full px-2">
            <h3 className="text-sm font-bold text-white truncate">{currentSong.title}</h3>
            <p className="text-xs text-gray-400 truncate mt-1">{currentSong.artist}</p>
          </div>
        </div>

        {/* 歌词视图 */}
        <div className={`absolute inset-0 flex flex-col items-center transition-all duration-500 transform ${showLyrics ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
          <div className="w-full h-full overflow-y-auto no-scrollbar mask-image-linear-fade text-center space-y-4 py-8">
            {lyricsLines.length > 0 ? (
              lyricsLines.map((line, i) => (
                <p 
                  key={i} 
                  className={`text-xs transition-all duration-300 ${i === activeLyricIndex ? 'text-[#ec4141] font-bold scale-110' : 'text-gray-500 scale-100'}`}
                >
                  {line.text}
                </p>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                <p className="text-xs">No lyrics</p>
                <p className="text-[10px] opacity-50">Edit 'lrc' in JSON</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部控制 */}
      <div className="relative z-20">
        <div 
          className="w-full h-1 bg-white/10 rounded-full mb-3 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (audioRef.current && audioRef.current.duration) {
                audioRef.current.currentTime = percent * audioRef.current.duration;
            }
          }}
        >
          <div className="h-full bg-[#ec4141] rounded-full relative" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <button onClick={playPrev} className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" className="opacity-80"/>
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ec4141] text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:scale-105 shadow-lg"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          
          <button onClick={playNext} className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" className="opacity-80"/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 主预览组件 ====================
export default function Preview({ data }) {
  const primary = data.primaryColor || "#60a5fa";

  return (
    <div className="relative min-h-full w-full flex items-center justify-center p-6 md:p-10 lg:p-16 bg-[#09090b] overflow-hidden font-sans text-slate-200">
      
      {/* 核心动画样式 */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes curtainLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes curtainRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes music-bar {
          0%, 100% { height: 4px; opacity: 0.5; }
          50% { height: 16px; opacity: 1; }
        }
        @keyframes floatUp {
          0% { transform: translateY(100%); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-20%); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-image-linear-fade {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
      `}</style>

      {/* 遮罩 */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-black z-50 pointer-events-none" style={{ animation: 'curtainLeft 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards 0.2s' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-black z-50 pointer-events-none" style={{ animation: 'curtainRight 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards 0.2s' }} />

      {/* 背景 */}
      <div className="absolute inset-0 z-0">
        <img src={data.bgPreview} alt="Background" className="w-full h-full object-cover transition-opacity duration-700" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full pointer-events-none"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                bottom: '-20px',
                animation: `floatUp ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `-${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* 1. Profile */}
        <div 
          className="md:col-span-2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 sm:p-8 shadow-2xl animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <img src={data.avatarPreview} alt="Avatar" className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white/20 shadow-lg" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{data.name || "你的名字"}</h1>
                <p className="text-base font-medium mt-1" style={{ color: primary }}>{data.title || "Full Stack Developer"}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {data.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[11px] bg-white/10 text-white/90 border border-white/5 backdrop-blur-sm">#{tag}</span>
                ))}
              </div>
              <p className="text-sm text-gray-200/90 leading-relaxed whitespace-pre-wrap">{data.about}</p>
              {data.socials?.length > 0 && (
                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                  {data.socials.map((social, i) => {
                    const Icon = IconMap[social.icon] || Globe;
                    return (
                      <a key={i} href={social.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white hover:scale-110 transition-all duration-300">
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. 音乐播放器 (集成) */}
        <MusicPlayer playlist={data.playlist || DEFAULT_PLAYLIST} primaryColor={primary} />

        {/* 3. Tech Stack */}
        <div 
          className="md:col-span-2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-xl animate-fade-up"
          style={{ animationDelay: '0.8s' }}
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{background: primary}}></span>
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.tags?.length ? data.tags.map((tag, i) => (
              <div key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/10 transition-colors">{tag}</div>
            )) : <p className="text-xs text-gray-500">Add tags...</p>}
          </div>
        </div>

        {/* 4. Articles */}
        <div 
          className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-xl animate-fade-up"
          style={{ animationDelay: '0.9s' }}
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{background: primary}}></span>
            Latest Posts
          </h2>
          <div className="space-y-3">
             {data.articles?.map((a, i) => (
                <a key={i} href={a.link} target="_blank" className="group block">
                  <p className="text-xs font-medium text-gray-200 group-hover:text-blue-300 transition-colors truncate">{a.title || "No Title"}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{a.date}</p>
                </a>
             ))}
          </div>
        </div>

        {/* 5. Projects (修复了显示首字母的问题) */}
        {data.projects?.map((proj, i) => (
            <a
              key={i}
              href={proj.link}
              target="_blank"
              rel="noreferrer"
              className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:-translate-y-1 hover:bg-black/50 hover:border-white/20 transition-all duration-300 shadow-xl group animate-fade-up flex flex-col h-full"
              style={{ animationDelay: `${1.0 + (i * 0.15)}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                {/* 
                   修复逻辑：
                   1. 优先显示 proj.image (如果有图片URL)
                   2. 否则显示一个漂亮的文件夹图标 
                   3. 不再显示单一的首字母 
                */}
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-900/50 border border-white/10 flex items-center justify-center overflow-hidden">
                   {proj.image ? (
                     <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                   ) : (
                     <Folder size={20} className="text-white/80" />
                   )}
                </div>
                <ArrowUpRight className="text-gray-500 group-hover:text-white transition-colors" size={16}/>
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{proj.title || "Project Name"}</h3>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{proj.desc || "No description provided."}</p>
              </div>
            </a>
        ))}

      </div>
    </div>
  );
}