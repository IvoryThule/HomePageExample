import React, { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, ListMusic, 
  X, Volume2, VolumeX, Volume1 
} from "lucide-react";
import { parseLrc } from "./lrc";
import { secureUrl } from "./audioUtils";
import { DEFAULT_PLAYLIST } from "./playlist"; 

const MusicPlayer = ({ playlist = DEFAULT_PLAYLIST, primaryColor = "#000000" }) => {
  // === 状态管理 ===
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 进度条
  const [progress, setProgress] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  
  // 歌词
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsLines, setLyricsLines] = useState([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  
  // 音量
  const [volume, setVolume] = useState(0.5); 
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const middleAreaRef = useRef(null);

  const currentSong = playlist[currentIndex];

  useEffect(() => {
    setLyricsLines(parseLrc(currentSong.lrc));
    setActiveLyricIndex(0);
    setLoadError(false);
  }, [currentIndex, currentSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.warn);
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

  const handleAudioError = () => {
    console.warn(`Song ID ${currentSong.id} load failed. Skipping...`);
    setLoadError(true);
    setTimeout(() => playNext(), 1000);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const timer = setTimeout(() => {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]); 

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && !isDragging) { 
      const current = audio.currentTime;
      const duration = audio.duration || 1;
      setProgress((current / duration) * 100);

      if (lyricsLines.length > 0) {
        let index = lyricsLines.findIndex(line => line.time > current) - 1;
        if (index < 0) {
            index = lyricsLines.findIndex(line => line.time > current);
            index = index === -1 ? lyricsLines.length - 1 : 0; 
        }
        
        const exactIndex = lyricsLines.findIndex((line, i) => {
            const nextLine = lyricsLines[i + 1];
            return current >= line.time && (!nextLine || current < nextLine.time);
        });
        
        if (exactIndex !== -1 && exactIndex !== activeLyricIndex) {
            setActiveLyricIndex(exactIndex);
        }
      }
    }
  };

  const handleSeekStart = () => {
    setIsPlaying(false);
    setIsDragging(true);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setProgress(val); 
  };

  const handleSeekEnd = (e) => {
    setIsDragging(false);
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration || 1;
      audioRef.current.currentTime = (val / 100) * duration;
      if (!audioRef.current.paused || isPlaying) {
          audioRef.current.play().catch(console.warn);
          setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
  if (middleAreaRef.current) {
    middleAreaRef.current.scrollTop = 0;
  }
}, [showLyrics]);

  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.querySelector(`.lyric-line-${activeLyricIndex}`);
      if (activeEl) {
        const scrollWait = setTimeout(() => {
            activeEl.scrollIntoView({
                behavior: 'smooth',
                block: 'center', 
            });
        }, 100);
        return () => clearTimeout(scrollWait);
      }
    }
  }, [activeLyricIndex, showLyrics]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val > 0 && isMuted) {
          setIsMuted(false);
          audioRef.current.muted = false;
      }
    }
  };
  
  useEffect(() => {
      if(audioRef.current) audioRef.current.volume = volume;
  }, []);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const getRgba = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
    if (!hex) return `rgba(0, 0, 0, ${alpha})`;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (hex.length === 9) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
      const aByte = parseInt(hex.slice(7, 9), 16);
      const aFromHex = Number.isFinite(aByte) ? aByte / 255 : 1;
      return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha * aFromHex))})`;
    }
    return `rgba(0, 0, 0, ${alpha})`;
  };

  const bgStyle = { backgroundColor: getRgba(primaryColor, 0.25) };

  return (
    <div 
      className="md:col-span-1 rounded-3xl border border-white/10 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group animate-fade-up flex flex-col h-[280px]"
      style={{ animationDelay: '0.7s', ...bgStyle }}
    >
      <audio
        ref={audioRef}
        src={`https://music.163.com/song/media/outer/url?id=${currentSong.id}.mp3`}
        onTimeUpdate={onTimeUpdate}
        onEnded={playNext}
        onError={handleAudioError}
        preload="auto"
      />

      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-full pointer-events-none opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* 顶部栏 */}
      <div className="flex items-center justify-between relative z-20 mb-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-[3px] items-end h-4">
            <span className={`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 ${isPlaying ? 'animate-[music-bar_0.8s_ease-in-out_infinite]' : 'h-1 opacity-50'}`}></span>
            <span className={`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 delay-75 ${isPlaying ? 'animate-[music-bar_1.0s_ease-in-out_infinite]' : 'h-2 opacity-50'}`}></span>
            <span className={`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 delay-150 ${isPlaying ? 'animate-[music-bar_0.6s_ease-in-out_infinite]' : 'h-1 opacity-50'}`}></span>
          </div>
          <span className="text-[10px] font-bold text-[#ec4141] uppercase tracking-widest truncate max-w-[80px]">
            {loadError ? "Error" : "Playing"}
          </span>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 group/vol">
                <div className="w-0 overflow-hidden group-hover/vol:w-16 transition-all duration-300 ease-out flex items-center">
                    <input 
                        type="range" 
                        min="0" max="1" step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                </div>
                <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
                    <VolumeIcon size={16} />
                </button>
            </div>

            <button 
                onClick={() => setShowLyrics(!showLyrics)}
                className={`transition-colors ${showLyrics ? 'text-white' : 'text-white/50 hover:text-white'}`}
                title="Lyrics"
            >
                {showLyrics ? <X size={18} /> : <ListMusic size={18} />}
            </button>
        </div>
      </div>

      {/* 中间区域 */}
      <div ref={middleAreaRef} className="flex-1 relative flex items-center justify-center overflow-hidden mb-1">
        
        {/* 
          1. 封面视图 
          逻辑：
          - 隐藏时 (showLyrics=true): 向上浮动 (-translate-y-8)，透明 (opacity-0)，缩小 (scale-90)
          - 显示时 (showLyrics=false): 回到原位 (translate-y-0)，不透明 (opacity-100)，正常大小 (scale-100)
          这样当你切回来时，它会从上面（-8）平滑回到中间（0），也就是"下沉"效果。
        */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${showLyrics 
            ? 'opacity-0 scale-90 -translate-y-8 pointer-events-none' 
            : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <div className="relative w-24 h-24 mb-2"> {/* 保持w-24以防裁剪 */}
             <div className={`w-full h-full rounded-full border-[5px] border-black bg-black shadow-xl flex items-center justify-center ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                <img 
                  src={secureUrl(currentSong.cover)} 
                  alt="Cover" 
                  className="w-full h-full rounded-full object-cover opacity-90 border border-white/10" 
                />
                <div className="absolute w-2.5 h-2.5 bg-[#1a1a1a] rounded-full border border-white/20 z-10" />
             </div>
          </div>
          <div className="text-center w-full px-2">
            <h3 className="text-sm font-bold text-white truncate">{currentSong.title}</h3>
            <p className="text-xs text-gray-400 truncate mt-1">{currentSong.artist}</p>
          </div>
        </div>

        {/* 
          2. 歌词视图 
          逻辑与封面相反：
          - 显示时: 原位 (translate-y-0)
          - 隐藏时: 向下沉底 (translate-y-8)
        */}
        <div className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${showLyrics 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-110 translate-y-8 pointer-events-none'
          }`}
        >
          <div 
            ref={lyricsContainerRef}
            className="w-full h-full overflow-y-auto no-scrollbar mask-image-linear-fade text-center py-[50%]" 
          >
            {lyricsLines.length > 0 ? (
              lyricsLines.map((line, i) => (
                <p 
                  key={i} 
                  className={`lyric-line-${i} text-xs py-2 transition-all duration-500 ${i === activeLyricIndex ? 'text-[#ec4141] font-bold scale-110 blur-0' : 'text-gray-500 scale-100 blur-[0.5px]'}`}
                >
                  {line.text}
                </p>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-gray-500">纯音乐 / 无歌词</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部控制栏 */}
      <div className="relative z-20 mt-auto">
        <div className="w-full h-3 flex items-center justify-center relative group/progress mb-1">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#ec4141] rounded-full relative transition-all duration-100 ease-linear" 
                    style={{ width: `${progress}%` }}
                />
            </div>
            <input 
                type="range" 
                min="0" max="100" step="0.1"
                value={progress}
                onMouseDown={handleSeekStart} 
                onTouchStart={handleSeekStart}
                onChange={handleSeek}         
                onMouseUp={handleSeekEnd}     
                onTouchEnd={handleSeekEnd}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
                className={`absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none transition-opacity duration-200 ${isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover/progress:opacity-100'}`}
                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            />
        </div>

        <div className="flex items-center justify-between px-4 pb-1">
          <button onClick={playPrev} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <SkipBack size={20} fill="currentColor" className="opacity-80"/>
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#ec4141] text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:scale-105 shadow-lg active:scale-95"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          
          <button onClick={playNext} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <SkipForward size={20} fill="currentColor" className="opacity-80"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;