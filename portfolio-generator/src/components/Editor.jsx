import React, { useEffect } from "react";
import CategoryCard from "./ui/CategoryCard.jsx";
import Input from "./ui/Input.jsx";
import Textarea from "./ui/Textarea.jsx";
import Button from "./ui/Button.jsx";
import Badge from "./ui/Badge.jsx";

const SOCIAL_ICON_OPTIONS = [
  { label: "GitHub", value: "github" },
  { label: "Twitter/X", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Website", value: "web" },
];

export default function Editor({ data, setData }) {
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

  return (
    <div className="space-y-4 text-xs">
      <CategoryCard title="Basic Info">
        <div className="space-y-2">
          <div>
            <label className="block text-[11px] mb-1 text-gray-400">
              姓名 / Name
            </label>
            <Input
              name="name"
              value={data.name}
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
                value={data.primaryColor || "#60a5fa"}
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

