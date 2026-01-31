import React, { useState, useRef, useEffect } from "react";
import {
  Github,
  Twitter,
  Globe,
  Linkedin,
  ArrowUpRight,
  Folder,
  Layout,
} from "lucide-react";
import {
  AiOutlineQq,
  AiFillWechat,
  AiFillBilibili,
  AiFillTikTok,
} from "react-icons/ai";

import MusicPlayer from "./music/MusicPlayer";
import { DEFAULT_PLAYLIST } from "./music/playlist";

// ==================== 图标映射 ====================
export const IconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  web: Globe,
  qq: AiOutlineQq,
  wechat: AiFillWechat,
  bilibili: AiFillBilibili,
  tiktok: AiFillTikTok,
};

// ==================== 辅助函数：Hex 转 RGBA ====================
const hexToRgba = (hex, alpha = 1) => {
  let r = 0,
    g = 0,
    b = 0;
  // 处理异常或空值，默认为黑色
  if (!hex) return `rgba(0, 0, 0, ${alpha})`;

  // 处理简写 hex (例如 #fff)
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 处理标准 hex (例如 #ffffff)
  else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ==================== 主预览组件 ====================
export default function Preview({ data }) {
  const primary = data.primaryColor || "#000000ff";

  const loggedUsername = typeof window !== "undefined" ? localStorage.getItem("loggedUsername") || "" : "";

  // 生成卡片背景色：使用主色调，透明度设为 0.25 (可在此处调整深浅)
  // 如果想要更深一点，可以把 0.25 改成 0.4
  const cardBackgroundColor = hexToRgba(primary, 0.25);

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
      `}</style>

      {/* 遮罩 */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full bg-black z-50 pointer-events-none"
        style={{
          animation:
            "curtainLeft 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards 0.2s",
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-black z-50 pointer-events-none"
        style={{
          animation:
            "curtainRight 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards 0.2s",
        }}
      />

      {/* 背景 */}
      <div className="absolute inset-0 z-0">
        <img
          src={data.bgPreview}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full pointer-events-none"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                left: Math.random() * 100 + "%",
                bottom: "-20px",
                animation: `floatUp ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `-${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* 1. Profile */}
        <div
          className="md:col-span-2 rounded-3xl border border-white/10 backdrop-blur-md p-6 sm:p-8 shadow-2xl animate-fade-up"
          // 修改点：使用动态背景色替换了原来的 bg-black/40
          style={{ animationDelay: "0.6s", backgroundColor: cardBackgroundColor }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <img
                src={data.avatarPreview}
                alt="Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white/20 shadow-lg"
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                  {data.name || loggedUsername || "你的名字"}
                </h1>
                {/* 修改点：这里的颜色改为普通的灰色，不再强制跟随 primary */}
                <p className="text-base font-medium mt-1 text-gray-300">
                  {data.title || "Full Stack Developer"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {data.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-[11px] bg-white/10 text-white/90 border border-white/5 backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-200/90 leading-relaxed whitespace-pre-wrap">
                {data.about}
              </p>
              {data.socials?.length > 0 && (
                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                  {data.socials.map((social, i) => {
                    const Icon = IconMap[social.icon] || Globe;
                    return (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white hover:scale-110 transition-all duration-300"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. 音乐播放器 */}
        <MusicPlayer playlist={DEFAULT_PLAYLIST} primaryColor={data.primaryColor} />

        {/* 3. Tech Stack */}
        <div
          className="md:col-span-2 rounded-3xl border border-white/10 backdrop-blur-md p-6 shadow-xl animate-fade-up"
          // 修改点：应用动态背景色
          style={{ animationDelay: "0.8s", backgroundColor: cardBackgroundColor }}
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
            {/* 保留这个小装饰条跟随主色调，作为点缀 */}
            <span
              className="w-1 h-4 rounded-full"
              style={{ background: primary }}
            ></span>
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.tags?.length
              ? data.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/10 transition-colors"
                  >
                    {tag}
                  </div>
                ))
              : (
                <p className="text-xs text-gray-500">Add tags...</p>
              )}
          </div>
        </div>

        {/* 4. Articles */}
        <div
          className="rounded-3xl border border-white/10 backdrop-blur-md p-6 shadow-xl animate-fade-up"
          // 修改点：应用动态背景色
          style={{ animationDelay: "0.9s", backgroundColor: cardBackgroundColor }}
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
            <span
              className="w-1 h-4 rounded-full"
              style={{ background: primary }}
            ></span>
            Latest Posts
          </h2>
          <div className="space-y-3">
            {data.articles?.map((a, i) => (
              <a key={i} href={a.link} target="_blank" className="group block">
                <p className="text-xs font-medium text-gray-200 group-hover:text-blue-300 transition-colors truncate">
                  {a.title || "No Title"}
                </p>
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
            // 修改点：移除了 hover:bg-black/50，因为内联背景色优先级更高。现在主要靠 border 和 translate 做 hover 效果
            className="relative rounded-3xl border border-white/10 backdrop-blur-md p-6 hover:-translate-y-1 hover:border-white/30 transition-all duration-300 shadow-xl group animate-fade-up flex flex-col h-full"
            // 修改点：应用动态背景色
            style={{
              animationDelay: `${1.0 + i * 0.15}s`,
              backgroundColor: cardBackgroundColor,
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-900/50 border border-white/10 flex items-center justify-center overflow-hidden">
                {proj.image ? (
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Folder size={20} className="text-white/80" />
                )}
              </div>
              <ArrowUpRight className="text-gray-500 group-hover:text-white transition-colors" size={16} />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                {proj.title || "Project Name"}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                {proj.desc || "No description provided."}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}