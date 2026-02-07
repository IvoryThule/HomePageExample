import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./ui/CategoryCard.jsx";
import Input from "./ui/Input.jsx";
import Textarea from "./ui/Textarea.jsx";
import Button from "./ui/Button.jsx";
import Badge from "./ui/Badge.jsx";
import { Search, Plus, Trash2, CloudDownload, Music } from "lucide-react"; // 引入图标

import { fetchNeteasePlaylist, searchQQMusic } from "../utils/musicApi";

const SOCIAL_ICON_OPTIONS = [
  { label: "GitHub", value: "github" },
  { label: "Twitter/X", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Website", value: "web" },
  { label: "QQ", value: "qq" },
  { label: "WeChat", value: "wechat" },
  { label: "Bilibili", value: "bilibili" },
  { label: "TikTok", value: "tiktok" },
];

export default function Editor({ data, setData }) {
  const navigate = useNavigate();
  
  // === 新增状态：音乐编辑器相关 ===
  const [musicTab, setMusicTab] = useState("list"); // 'list' | 'netease' | 'qq'
  const [musicInput, setMusicInput] = useState(""); // 用于搜索框或歌单ID输入
  const [musicLoading, setMusicLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // QQ搜索结果

  const loggedUsername = typeof window !== "undefined" ? localStorage.getItem("loggedUsername") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedUsername");
      localStorage.removeItem("remembered_username");
    } catch (e) {}
    navigate("/login");
  };

  const updateField = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleColorChange = (e) => {
    updateField("primaryColor", e.target.value);
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 创建新 URL
    const objectUrl = URL.createObjectURL(file);
    setData((prev) => ({
      ...prev,
      [field]: file,
      [`${field}Preview`]: objectUrl,
    }));

    // 清理内存
    useEffect(() => {
      return () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }, [objectUrl]);
  };

  const addTag = () => {
    const tag = window.prompt("输入一个标签（如 React、UI、前端）");
    if (tag && tag.trim()) {
      updateField("tags", [...(data.tags || []), tag.trim()]);
    }
  };

  const removeTag = (index) => {
    const next = [...data.tags];
    next.splice(index, 1);
    updateField("tags", next);
  };

  const addSocial = () => {
    updateField("socials", [
      ...(data.socials || []),
      { platform: "GitHub", url: "", icon: "github" },
    ]);
  };

  const updateSocial = (index, key, value) => {
    const next = [...data.socials];
    next[index] = { ...next[index], [key]: value };
    updateField("socials", next);
  };

  const removeSocial = (index) => {
    const next = [...data.socials];
    next.splice(index, 1);
    updateField("socials", next);
  };

  const addProject = () => {
    updateField("projects", [
      ...(data.projects || []),
      { title: "新项目", desc: "", link: "" },
    ]);
  };

  const updateProject = (index, key, value) => {
    const next = [...data.projects];
    next[index] = { ...next[index], [key]: value };
    updateField("projects", next);
  };

  const removeProject = (index) => {
    const next = [...data.projects];
    next.splice(index, 1);
    updateField("projects", next);
  };

  const addArticle = () => {
    updateField("articles", [
      ...(data.articles || []),
      { title: "新文章", date: "2024-01-01", link: "" },
    ]);
  };

  const updateArticle = (index, key, value) => {
    const next = [...data.articles];
    next[index] = { ...next[index], [key]: value };
    updateField("articles", next);
  };

  const removeArticle = (index) => {
    const next = [...data.articles];
    next.splice(index, 1);
    updateField("articles", next);
  };

  // === 新增音乐处理函数 ===

  // 1. 删除歌曲
  const removeSong = (index) => {
    const next = [...(data.playlist || [])];
    next.splice(index, 1);
    updateField("playlist", next);
  };

  // 2. 网易云导入
  const handleNeteaseImport = async () => {
    // 支持如果不输入，使用默认歌单 ID
    const targetId = musicInput.trim() || "17606278641"; 
    
    setMusicLoading(true);
    try {
      // 调用我们在 musicApi.js 里写的函数
      const songs = await fetchNeteasePlaylist(targetId);
      if (songs.length === 0) {
        alert("未找到歌曲，请检查 ID 或确认歌单公开");
      } else {
        // 追加到现有列表
        const next = [...(data.playlist || []), ...songs];
        updateField("playlist", next);
        setMusicInput(""); // 清空输入
        alert(`成功导入 ${songs.length} 首歌曲`);
        setMusicTab("list"); // 切回列表视图
      }
    } catch (e) {
      console.error(e);
      alert("导入失败，请检查控制台");
    } finally {
      setMusicLoading(false);
    }
  };

  // 3. QQ 音乐搜索
  const handleQQSearch = async () => {
    if (!musicInput) return;
    setMusicLoading(true);
    try {
      const results = await searchQQMusic(musicInput);
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setMusicLoading(false);
    }
  };

  // 4. 添加搜索到的 QQ 歌曲
  const addQQSong = (song) => {
    const next = [...(data.playlist || []), song];
    updateField("playlist", next);
    // 可选：添加后是否清空结果？这里不清空方便继续添加
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 账户信息卡片（已登录时显示） */}
      {token && (
        <CategoryCard title="账户信息">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">已登录：{loggedUsername || "用户"}</div>
            <Button
              onClick={handleLogout}
              className="!bg-red-900/40 !border-red-600/60 !text-red-300 hover:!bg-red-800/60"
            >
              退出登录
            </Button>
          </div>
        </CategoryCard>
      )}
      <CategoryCard title="Basic Info">
        <div className="space-y-2">
          <div>
            <label className="block text-[11px] mb-1 text-gray-400">
              姓名 / Name
            </label>
            <Input
              name="name"
              value={data.name || loggedUsername || ""}
              onChange={handleBasicChange}
              placeholder="例如：IvoryThule"
            />
          </div>
          <div>
            <label className="block text-[11px] mb-1 text-gray-400">
              职位 / Title
            </label>
            <Input
              name="title"
              value={data.title}
              onChange={handleBasicChange}
              placeholder="例如：Full Stack Developer"
            />
          </div>
          <div>
            <label className="block text-[11px] mb-1 text-gray-400">
              一句话简介 / About
            </label>
            <Textarea
              rows={4}
              name="about"
              value={data.about}
              onChange={handleBasicChange}
              placeholder="可以写多行简介，导出时会作为纯文本展示。"
            />
          </div>
        </div>
      </CategoryCard>

      <CategoryCard title="Theme & Images">
        <div className="space-y-2">
          <div>
            <label className="block text-[11px] mb-1 text-gray-400">
              主色调 / Primary Color
            </label>
              <div className="flex items-center gap-2">
              <input
                type="color"
                value={(data.primaryColor || "#60a5fa").slice(0,7)}
                onChange={handleColorChange}
                className="w-8 h-8 rounded-md border border-gray-700 bg-transparent"
              />
              <Input
                value={data.primaryColor || "#60a5fa"}
                onChange={handleColorChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] mb-1 text-gray-400">
                头像 / Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "avatar")}
                className="block w-full text-[11px] text-gray-400 file:mr-2 file:px-2 file:py-1 file:text-[10px] file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />
              {data.avatarPreview && (
                <img
                  src={data.avatarPreview}
                  alt="avatar preview"
                  className="mt-2 w-full h-20 object-cover rounded-lg border border-gray-800"
                />
              )}
            </div>
            <div>
              <label className="block text-[11px] mb-1 text-gray-400">
                背景图 / Background
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "bg")}
                className="block w-full text-[11px] text-gray-400 file:mr-2 file:px-2 file:py-1 file:text-[10px] file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />
              {data.bgPreview && (
                <div className="mt-2 relative">
                  <img
                    src={data.bgPreview}
                    alt="bg preview"
                    className="w-full h-20 object-cover rounded-lg border border-gray-800"
                  />
                  <div className="absolute inset-0 rounded-lg bg-black/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </CategoryCard>

      {/* === 新增：音乐配置卡片 === */}
      <CategoryCard title="Music Player / 音乐播放器">
        
        {/* 顶部 Tab 切换 */}
        <div className="flex bg-gray-900/50 p-1 rounded-lg mb-3 border border-gray-800">
          <button
            onClick={() => setMusicTab("list")}
            className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${
              musicTab === "list" ? "bg-gray-700 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            当前列表 ({data.playlist?.length || 0})
          </button>
          <button
            onClick={() => { setMusicTab("netease"); setMusicInput(""); }}
            className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${
              musicTab === "netease" ? "bg-red-900/30 text-red-200 border border-red-900/50" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            网易云导入
          </button>
          <button
            onClick={() => { setMusicTab("qq"); setMusicInput(""); setSearchResults([]); }}
            className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${
              musicTab === "qq" ? "bg-green-900/30 text-green-200 border border-green-900/50" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            QQ音乐搜索
          </button>
        </div>

        {/* Tab 内容：当前列表 */}
        {musicTab === "list" && (
          <div className="space-y-2">
            {!data.playlist?.length && (
              <div className="text-center py-4 text-gray-500 border border-dashed border-gray-800 rounded-lg">
                暂无歌曲，请切换 Tab 添加
              </div>
            )}
            {data.playlist?.map((song, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-900/30 p-2 rounded border border-gray-800 group hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-[10px] text-gray-500 w-4">{i + 1}</span>
                  {song.cover && <img src={song.cover} alt="" className="w-8 h-8 rounded object-cover" />}
                  <div className="flex flex-col truncate">
                    <span className="text-gray-200 truncate font-medium">{song.title}</span>
                    <span className="text-[10px] text-gray-500 truncate">{song.artist}</span>
                  </div>
                  {/* 显示来源标记 */}
                  <span className={`text-[9px] px-1 rounded ${song.platform === 'qq' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {song.platform === 'qq' ? 'QQ' : 'NEC'}
                  </span>
                </div>
                <button
                  onClick={() => removeSong(i)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 内容：网易云导入 */}
        {musicTab === "netease" && (
          <div className="space-y-3">
            <div className="bg-blue-900/10 border border-blue-900/30 p-2 rounded text-[10px] text-blue-200/70">
              <p>提示：输入网易云<b>歌单 ID</b>（数字）。最多导入50首歌曲</p>
              <p>若不输入任何内容，将默认使用推荐歌单 (ID: 17606278641)</p>
            </div>
            <div className="flex gap-2">
              <Input 
                value={musicInput} 
                onChange={(e) => setMusicInput(e.target.value)} 
                placeholder="输入歌单 ID (留空使用默认)" 
              />
              <Button onClick={() => {
                 if (!musicInput.trim()) {
                   setMusicInput("17606278641");
                   handleNeteaseImport(); // 注意：这可能因为 state 异步更新问题而不生效，最好在 handleNeteaseImport 内部判断
                 } else {
                   handleNeteaseImport();
                 }
              }} disabled={musicLoading}>
                {musicLoading ? "..." : <CloudDownload size={14} />}
              </Button>
            </div>
          </div>
        )}

        {/* Tab 内容：QQ音乐搜索 */}
        {musicTab === "qq" && (
          <div className="space-y-3">
             <div className="flex gap-2">
              <Input 
                value={musicInput} 
                onChange={(e) => setMusicInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleQQSearch()}
                placeholder="搜索歌曲 / 歌手..." 
              />
              <Button onClick={handleQQSearch} disabled={musicLoading}>
                {musicLoading ? "..." : <Search size={14} />}
              </Button>
            </div>

            {/* 搜索结果列表 */}
            <div className="max-h-[200px] overflow-y-auto space-y-1 custom-scrollbar pr-1">
              {searchResults.map((song, i) => (
                <div key={song.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5 border border-transparent hover:border-gray-700 transition-all">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={song.cover} className="w-8 h-8 rounded bg-gray-800" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-gray-200 truncate text-[11px]">{song.title}</span>
                      <span className="text-gray-500 truncate text-[10px]">{song.artist}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addQQSong(song)}
                    className="p-1.5 bg-white/10 hover:bg-green-600 text-white rounded-full transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}
              {searchResults.length === 0 && !musicLoading && musicInput && (
                 <div className="text-center text-gray-600 text-[10px] py-2">暂无结果或未搜索</div>
              )}
            </div>
          </div>
        )}
      </CategoryCard>

      <CategoryCard title="Tags / 技能标签">
        <div className="flex flex-wrap gap-2 mb-2">
          {data.tags?.map((tag, i) => (
            <Badge key={`${tag}-${i}`} className="flex items-center gap-1">
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="text-[10px] text-gray-400 hover:text-red-400"
              >
                ×
              </button>
            </Badge>
          ))}
          {!data.tags?.length && (
            <span className="text-[11px] text-gray-500">
              暂无标签，点击下方按钮添加。
            </span>
          )}
        </div>
        <Button onClick={addTag}>+ 添加标签</Button>
      </CategoryCard>

      <CategoryCard title="Social Links / 社交链接">
        <div className="space-y-2">
          {data.socials?.map((s, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-lg p-2 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={s.platform}
                  onChange={(e) =>
                    updateSocial(i, "platform", e.target.value)
                  }
                  placeholder="平台名称，如 GitHub"
                />
                <select
                  value={s.icon || "web"}
                  onChange={(e) => updateSocial(i, "icon", e.target.value)}
                  className="bg-gray-900/80 border border-gray-700 rounded-lg px-2 py-1 text-[11px] text-gray-200 focus:outline-none"
                >
                  {SOCIAL_ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                value={s.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                placeholder="https://..."
              />
              <div className="flex justify-end">
                <Button
                  className="!text-red-300 !border-red-600/60 !bg-red-900/40 hover:!bg-red-800/60"
                  onClick={() => removeSocial(i)}
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addSocial}>+ 添加社交链接</Button>
        </div>
      </CategoryCard>

      <CategoryCard title="Projects / 作品集">
        <div className="space-y-2">
          {data.projects?.map((p, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-lg p-2 space-y-1"
            >
              <Input
                value={p.title}
                onChange={(e) => updateProject(i, "title", e.target.value)}
                placeholder="项目标题"
              />
              <Textarea
                rows={2}
                value={p.desc}
                onChange={(e) => updateProject(i, "desc", e.target.value)}
                placeholder="项目描述"
              />
              <Input
                value={p.link}
                onChange={(e) => updateProject(i, "link", e.target.value)}
                placeholder="项目链接（可选）"
              />
              <div className="flex justify-end">
                <Button
                  className="!text-red-300 !border-red-600/60 !bg-red-900/40 hover:!bg-red-800/60"
                  onClick={() => removeProject(i)}
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addProject}>+ 添加项目</Button>
        </div>
      </CategoryCard>

      <CategoryCard title="Articles / 博客与文章">
        <div className="space-y-2">
          {data.articles?.map((a, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-lg p-2 space-y-1"
            >
              <Input
                value={a.title}
                onChange={(e) => updateArticle(i, "title", e.target.value)}
                placeholder="文章标题"
              />
              <div className="grid grid-cols-[minmax(0,1fr),90px] gap-2">
                <Input
                  value={a.link}
                  onChange={(e) => updateArticle(i, "link", e.target.value)}
                  placeholder="文章链接"
                />
                <Input
                  value={a.date}
                  onChange={(e) => updateArticle(i, "date", e.target.value)}
                  placeholder="日期，如 2024-01-01"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  className="!text-red-300 !border-red-600/60 !bg-red-900/40 hover:!bg-red-800/60"
                  onClick={() => removeArticle(i)}
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addArticle}>+ 添加文章</Button>
        </div>
      </CategoryCard>
    </div>
  );
}

