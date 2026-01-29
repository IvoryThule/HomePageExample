import React, { useState } from "react";
import Editor from "./components/Editor.jsx";
import Preview from "./components/Preview.jsx";
import { generateZip } from "./utils/generateZip.js";
import { Download } from "lucide-react";

const initialData = {
  name: "IvoryThule",
  title: "Full Stack Developer",
  about:
    "热爱技术，专注于创造美好的用户体验。\n\n这里可以写一些更长的个人介绍、价值观或职业规划。",
  tags: ["React", "Node.js", "UI Design"],
  socials: [
    { platform: "GitHub", url: "https://github.com/yourname", icon: "github" },
    {
      platform: "Twitter/X",
      url: "https://twitter.com/yourname",
      icon: "twitter",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/yourname",
      icon: "linkedin",
    },
  ],
  projects: [
    {
      title: "项目 A",
      desc: "一个很酷的 React 项目，展示组件化与动画效果。",
      link: "#",
    },
    {
      title: "项目 B",
      desc: "基于 Vue 的后台管理系统，支持多种数据可视化。",
      link: "#",
    },
  ],
  articles: [
    { title: "如何设计一个优秀的个人主页", date: "2024-06-01", link: "#" },
    {
      title: "前端性能优化的 10 个实用技巧",
      date: "2024-03-15",
      link: "#",
    },
  ],
  primaryColor: "#000000ff",
  avatar: null,
  background: null,
  avatarPreview: "https://via.placeholder.com/256x256.png?text=Avatar",
  bgPreview: "https://via.placeholder.com/1920x1080.png?text=Background",
};

export default function App() {
  const [data, setData] = useState(initialData);
  const [exporting, setExporting] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      await generateZip(data);
    } catch (error) {
      console.error(error);
      alert("导出失败，请打开控制台查看错误信息。");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      <div className="w-[380px] lg:w-[420px] border-r border-gray-900 flex flex-col bg-[#050509]">
        <div className="px-5 py-4 border-b border-gray-900 flex justify-between items-start gap-3">
          <div>
            <h1 className="font-semibold text-xl text-zinc-50 tracking-tight">
              Portfolio Generator
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              实时配置 · 一键导出静态站点
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setFullPreview(true)}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium border border-gray-700/80 text-gray-200 hover:border-blue-400/80 hover:text-blue-300 bg-gray-900/80 transition-colors"
            >
              预览完整页面
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-semibold border border-blue-500/80 text-blue-100 bg-blue-600/20 hover:bg-blue-600/35 hover:border-blue-400 disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={14} />
              {exporting ? "导出中..." : "导出网站"}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
          <Editor data={data} setData={setData} />
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto custom-scrollbar bg-[#05060a]">
        <Preview data={data} />
      </div>

      {fullPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => setFullPreview(false)}
            className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-black/60 border border-gray-700 text-xs text-gray-200 hover:bg-black/80"
          >
            关闭预览
          </button>
          <div className="w-full h-full overflow-auto custom-scrollbar">
            <Preview data={data} />
          </div>
        </div>
      )}
    </div>
  );
}


