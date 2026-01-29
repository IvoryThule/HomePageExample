import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, ListMusic, X } from "lucide-react";
import { parseLrc } from "./lrc";
import { secureUrl } from "./audioUtils";
import { DEFAULT_PLAYLIST } from "./playlist";

// MusicPlayer 组件（逻辑与原来保持一致，只是文件拆分）
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

export default MusicPlayer;