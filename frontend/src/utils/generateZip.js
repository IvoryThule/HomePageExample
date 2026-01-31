import JSZip from "jszip";
import { saveAs } from "file-saver";
import { DEFAULT_PLAYLIST } from "../components/music/playlist";

// ==================================================================================
// 1. 图标定义 (注入到 HTML 的 React 组件)
// ==================================================================================
const ICONS_JS_STRING = `
const Icons = {
  Github: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>,
  Twitter: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  Linkedin: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
  Globe: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ArrowUpRight: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>,
  Folder: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>,
  Play: ({size=20, className, fill}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: ({size=20, className, fill}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>,
  SkipBack: ({size=20, className, fill}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" x2="5" y1="19" y2="5"/></svg>,
  SkipForward: ({size=20, className, fill}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/></svg>,
  ListMusic: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/></svg>,
  X: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Volume2: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  VolumeX: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>,
  Volume1: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  QQ: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2c-2.5 0-4 2-4 2s-1.5-2-4-2c-2 0-4 2-4 4 0 2 2 4 4 4 0 0-1 2-1 4s1 4 5 4 5-2 5-4-1-4-1-4c2 0 4-2 4-4 0-2-2-4-4-4z"/></svg>,
  WeChat: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2a6 6 0 0 1 6 6c0 3.3-2.7 6-6 6-1.1 0-2.1-.3-3-.8-1.1.5-2.3.8-3.5.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.2 0 2.4.3 3.5.8 1-.5 2-.8 3-.8z"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M9 15c-2.2 0-4 1.8-4 4s1.8 4 4 4c.7 0 1.4-.2 2-.5.6.3 1.3.5 2 .5 2.2 0 4-1.8 4-4s-1.8-4-4-4c-.7 0-1.4.2-2 .5-.6-.3-1.3-.5-2-.5z"/><circle cx="7" cy="19" r="1"/><circle cx="11" cy="19" r="1"/></svg>,
  Bilibili: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M8 2 12 6l4-4"/><path d="M9 12h.01M15 12h.01"/></svg>,
  TikTok: ({size=20, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 17a4 4 0 1 1 3-6.7V3h3a5 5 0 0 0 5 5v3a8 8 0 1 1-11-7.5"/></svg>,
};
`;

// ==================================================================================
// 2. MusicPlayer 组件代码 (直接注入)
// ==================================================================================
const MUSIC_PLAYER_CODE = `
const { useState, useRef, useEffect } = React;
const { Play, Pause, SkipBack, SkipForward, ListMusic, X, Volume2, VolumeX, Volume1 } = Icons;

function parseLrc(lrcString) {
  if (!lrcString) return [];
  const lines = lrcString.split("\\n");
  const result = [];
  const timeExp = /\\[(\\d{2}):(\\d{2})\\.(\\d{2,3})\\]/;

  lines.forEach((line) => {
    const match = timeExp.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const msVal = match[3].length === 2 ? ms * 10 : ms;
      const time = min * 60 + sec + msVal / 1000;
      const text = line.replace(timeExp, "").trim();
      if (text) result.push({ time, text });
    }
  });
  return result;
}

function secureUrl(url) {
  if (!url) return "";
  if (url.startsWith("assets/")) return url;
  return url.replace(/^http:\\/\\//i, 'https://');
}

const MusicPlayer = ({ playlist, primaryColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsLines, setLyricsLines] = useState([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [volume, setVolume] = useState(0.5); 
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const middleAreaRef = useRef(null);

  if (!playlist || playlist.length === 0) return null;
  const currentSong = playlist[currentIndex];

  useEffect(() => {
    setLyricsLines(parseLrc(currentSong.lrc));
    setActiveLyricIndex(0);
    setLoadError(false);
  }, [currentIndex, currentSong]);

  const getAudioSrc = (song) => {
    if(song.src) return song.src; 
    return \`https://music.163.com/song/media/outer/url?id=\${song.id}.mp3\`;
  };

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
    console.warn(\`Song load failed. Skipping...\`);
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
      const activeEl = lyricsContainerRef.current.querySelector(\`.lyric-line-\${activeLyricIndex}\`);
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
      let r=0,g=0,b=0;
      if(!hex) return \`rgba(0,0,0,\${alpha})\`;
      if(hex.length===4){
          r=parseInt(hex[1]+hex[1],16);g=parseInt(hex[2]+hex[2],16);b=parseInt(hex[3]+hex[3],16);
      } else if(hex.length===7){
          r=parseInt(hex.slice(1,3),16); g=parseInt(hex.slice(3,5),16); b=parseInt(hex.slice(5,7),16);
      }
      return \`rgba(\${r},\${g},\${b},\${alpha})\`;
  }
  const bgStyle = { backgroundColor: getRgba(primaryColor, 0.25) };

  return (
    <div 
      className="md:col-span-1 rounded-3xl border border-white/10 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group animate-fade-up flex flex-col h-[280px]"
      style={{ animationDelay: '0.7s', ...bgStyle }}
    >
      <audio
        ref={audioRef}
        src={getAudioSrc(currentSong)}
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
            <span className={\`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 \${isPlaying ? 'animate-[music-bar_0.8s_ease-in-out_infinite]' : 'h-1 opacity-50'}\`}></span>
            <span className={\`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 delay-75 \${isPlaying ? 'animate-[music-bar_1.0s_ease-in-out_infinite]' : 'h-2 opacity-50'}\`}></span>
            <span className={\`w-1 bg-[#ec4141] rounded-sm transition-all duration-300 delay-150 \${isPlaying ? 'animate-[music-bar_0.6s_ease-in-out_infinite]' : 'h-1 opacity-50'}\`}></span>
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
                        className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
                    <VolumeIcon size={16} />
                </button>
            </div>

            <button 
                onClick={() => setShowLyrics(!showLyrics)}
                className={\`transition-colors \${showLyrics ? 'text-white' : 'text-white/50 hover:text-white'}\`}
                title="Lyrics"
            >
                {showLyrics ? <X size={18} /> : <ListMusic size={18} />}
            </button>
        </div>
      </div>

      {/* 中间区域 */}
      <div ref={middleAreaRef} className="flex-1 relative flex items-center justify-center overflow-hidden mb-1">
        
        {/* 封面视图 */}
        <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
          \${showLyrics 
            ? 'opacity-0 scale-90 -translate-y-8 pointer-events-none' 
            : 'opacity-100 scale-100 translate-y-0'
          }\`}
        >
          <div className="relative w-24 h-24 mb-2">
             <div className={\`w-full h-full rounded-full border-[5px] border-black bg-black shadow-xl flex items-center justify-center \${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}\`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
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

        {/* 歌词视图 */}
        <div className={\`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
          \${showLyrics 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-110 translate-y-8 pointer-events-none'
          }\`}
        >
          <div 
            ref={lyricsContainerRef}
            className="w-full h-full overflow-y-auto no-scrollbar mask-image-linear-fade text-center py-[50%]" 
          >
            {lyricsLines.length > 0 ? (
              lyricsLines.map((line, i) => (
                <p 
                  key={i} 
                  className={\`lyric-line-\${i} text-xs py-2 transition-all duration-500 \${i === activeLyricIndex ? 'text-[#ec4141] font-bold scale-110 blur-0' : 'text-gray-500 scale-100 blur-[0.5px]'}\`}
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
                    style={{ width: \`\${progress}%\` }}
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
                className={\`absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none transition-opacity duration-200 \${isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover/progress:opacity-100'}\`}
                style={{ left: \`\${progress}%\`, transform: 'translateX(-50%)' }}
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
`;

// ==================================================================================
// 3. Preview 组件代码 (直接注入)
// ==================================================================================
const PREVIEW_CODE = `
const { Github, Twitter, Linkedin, Globe, ArrowUpRight, Folder } = Icons;
const IconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  web: Globe,
};

const hexToRgba = (hex, alpha = 1) => {
  let r = 0, g = 0, b = 0;
  if (!hex) return \`rgba(0, 0, 0, \${alpha})\`;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`;
};

const Preview = ({ data }) => {
  const primary = data.primaryColor || "#000000";
  const cardBackgroundColor = hexToRgba(primary, 0.25);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-10 lg:p-16 bg-[#09090b] overflow-hidden font-sans text-slate-200">
      
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
                animation: \`floatUp \${Math.random() * 10 + 10}s linear infinite\`,
                animationDelay: \`-\${Math.random() * 10}s\`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* 1. Profile */}
        <div 
          className="md:col-span-2 rounded-3xl border border-white/10 backdrop-blur-md p-6 sm:p-8 shadow-2xl animate-fade-up"
          style={{ animationDelay: '0.6s', backgroundColor: cardBackgroundColor }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <img src={data.avatarPreview} alt="Avatar" className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white/20 shadow-lg" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{data.name || "你的名字"}</h1>
                <p className="text-base font-medium mt-1 text-gray-300">{data.title || "Full Stack Developer"}</p>
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

        {/* 2. Music Player */}
        <MusicPlayer playlist={data.playlist} primaryColor={primary} />

        {/* 3. Tech Stack */}
        <div 
          className="md:col-span-2 rounded-3xl border border-white/10 backdrop-blur-md p-6 shadow-xl animate-fade-up"
          style={{ animationDelay: '0.8s', backgroundColor: cardBackgroundColor }}
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
          className="rounded-3xl border border-white/10 backdrop-blur-md p-6 shadow-xl animate-fade-up"
          style={{ animationDelay: '0.9s', backgroundColor: cardBackgroundColor }}
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

        {/* 5. Projects */}
        {data.projects?.map((proj, i) => (
            <a
              key={i}
              href={proj.link}
              target="_blank"
              rel="noreferrer"
              className="relative rounded-3xl border border-white/10 backdrop-blur-md p-6 hover:-translate-y-1 hover:border-white/30 transition-all duration-300 shadow-xl group animate-fade-up flex flex-col h-full"
              style={{ animationDelay: \`\${1.0 + (i * 0.15)}s\`, backgroundColor: cardBackgroundColor }}
            >
              <div className="flex justify-between items-start mb-4">
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
};
`;

// ==================================================================================
// 4. 生成 Zip 主逻辑
// ==================================================================================
export const generateZip = async (data) => {
  const zip = new JSZip();
  const assetsFolder = zip.folder("assets");
  const safeName = (data.name || "My_Portfolio").replace(/\s+/g, "_");

  // 深拷贝数据
  const exportData = JSON.parse(JSON.stringify(data));
  
  // 填充默认播放列表
  if (!exportData.playlist || exportData.playlist.length === 0) {
    exportData.playlist = DEFAULT_PLAYLIST;
  }

  // === 1. 头像处理 ===
  if (data.avatar instanceof File || data.avatar instanceof Blob) {
    const ext = data.avatar.name?.split(".").pop() || "png";
    const filename = `avatar.${ext}`;
    assetsFolder.file(filename, data.avatar);
    exportData.avatarPreview = `assets/${filename}`;
  }

  // === 2. 背景图处理 (这里修正为使用 data.bg) ===
  // 注意：在 Editor.jsx 中，ImageUpload(e, "bg") 意味着文件在 data.bg
  if (data.bg instanceof File || data.bg instanceof Blob) {
    // 情况 A：用户上传了新背景
    const ext = data.bg.name?.split(".").pop() || "jpg";
    const filename = `background.${ext}`;
    assetsFolder.file(filename, data.bg);
    exportData.bgPreview = `assets/${filename}`;
  } else if (typeof data.bgPreview === "string" && !data.bgPreview.startsWith("blob:")) {
    // 情况 B：默认 URL 或外部 URL
    exportData.bgPreview = data.bgPreview;
  } else {
    // 情况 C：兜底
    exportData.bgPreview = "https://via.placeholder.com/1920x1080.png?text=Background";
  }

  // === 3. 音乐文件处理 ===
  await Promise.all(
    (data.playlist || []).map(async (item, index) => {
      if (item.file instanceof File || item.file instanceof Blob) {
        const ext = item.file.name?.split(".").pop() || "mp3";
        const filename = `music_${index}.${ext}`;
        assetsFolder.file(filename, item.file);
        exportData.playlist[index].src = `assets/${filename}`;
      }
    })
  );

  // === 构建 HTML ===
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.name || "个人主页"} - Portfolio</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
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
      mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const userData = ${JSON.stringify(exportData)};

    ${ICONS_JS_STRING}

    ${MUSIC_PLAYER_CODE}

    ${PREVIEW_CODE}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Preview data={userData} />);
  </script>
</body>
</html>`;

  zip.file("index.html", html);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${safeName}_Portfolio.zip`);
};