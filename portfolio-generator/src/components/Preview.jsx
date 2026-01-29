import React, { useState, useRef, useEffect } from "react";
import { 
  Github, Twitter, Globe, Linkedin, ArrowUpRight, Folder, Layout
} from "lucide-react";
import MusicPlayer from "./music/MusicPlayer";
import { DEFAULT_PLAYLIST } from "./music/playlist";

// ==================== 图标映射 ====================
export const IconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  web: Globe,
};

// 音乐播放逻辑已拆分到 ./music 文件夹，保留原有使用方式：
// 在 Preview 中仍通过 <MusicPlayer playlist={data.playlist || DEFAULT_PLAYLIST} primaryColor={primary} /> 使用

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