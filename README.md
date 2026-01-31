# 🍱 visual-homepage-builder — 可视化个人主页生成器

一个基于 React + Vite 的可视化个人主页编辑器与若干静态模板。前端负责所见即所得的编辑、实时预览与导出静态站点；后端（可选）提供用户注册/登录与配置云端保存功能。

![编辑器截图](./MarkdownImages/screenshots/设置好信息之后的界面截图.png)

概述：用户在浏览器中使用编辑器填写信息、上传头像/背景、管理项目与标签，支持导出静态 ZIP。当前仓库由 `frontend/`（React 编辑器）与 `backend/`（Node.js API）组成，支持账号注册、通过用户名/邮箱登录以及把配置保存到数据库。

---

## 主要功能（当前）

- 可视化编辑器（实时预览 → 导出静态站点）
- 前端：React + Vite + Tailwind，支持图片上传、项目卡片、标签、内置音乐播放器
- 后端：Express + MySQL（连接池），提供注册/登录、JWT 验证、云端配置读取与保存
- 认证：注册需填写 `username`, `email`, `password`（邮箱格式校验），登录支持使用用户名或邮箱
- 本地与云端数据：已登录用户可以将配置保存到数据库；游客模式保存在本地 state（不上传）

---

## 快速开始（开发）

先决条件：Node.js 16+，MySQL（用于后端可选功能），npm

1) 启动后端（可选 — 如果你需要注册/登录与云端保存）

```powershell
cd .\backend
npm install
# 配置 .env（见下方说明），然后
npm run start
```

后端默认端口：`3001`（可通过 `backend/.env` 覆盖 `PORT`）。

2) 启动前端

```powershell
cd .\frontend
npm install
npm run dev
```

打开浏览器访问：

```
http://localhost:5173
```

页面说明：根路径会重定向到 `/login`；登录后进入 `/editor` 即可使用编辑器并（若已登录）保存到云端。

3) 构建生产（前端）

```powershell
cd .\frontend
npm run build
# 预览构建产物
npm --prefix frontend run preview
```

前端构建产物位于 `frontend/dist/`。

---

## 后端配置（.env）

在 `backend/.env` 中配置数据库与 JWT、例如：

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=portfolio_db
JWT_SECRET=please-change-this-secret
```

你也可以添加 SMTP 配置以便日后扩展邮件验证功能。

---

## API 摘要（开发者参考）

- POST `/api/auth/register` — 注册：接收 `{ username, email, password }`，返回 `{ token, username }`
- POST `/api/auth/login` — 登录：接收 `{ username, password }`（username 可为用户名或邮箱），返回 `{ token, username }`
- GET `/api/config` — 获取当前用户配置（需 Authorization: Bearer <token>）
- POST `/api/config` — 保存/更新当前用户配置（需 Authorization）

---

## 数据库迁移（重要）

注册已改为写入 `email` 字段；若你的 `users` 表目前没有 `email` 列，请备份数据库并执行：

```sql
ALTER TABLE users
  ADD COLUMN email VARCHAR(255) NULL,
  ADD UNIQUE INDEX ux_users_email (email);
```

或从头使用如下建表语句（MySQL 5.7+）：

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(191) NOT NULL UNIQUE,
  email VARCHAR(255) NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

注意：请在执行迁移前备份数据（`mysqldump`）。

---

## 仓库结构（节选）

下面列出仓库中主要文件与目录，并简要说明各自用途，便于快速定位与二次开发。

```
visual-homepage-builder/
├─ README.md                # 本文件（项目说明、开发/运行步骤、迁移建议等）
├─ README.en.md             # 英文版说明（可补充/同步）
├─ LICENSE                 # 项目许可（MIT）
├─ assets/                 # 演示用图片、GIF、截图等静态资源
├─ MarkdownImages/         # 项目文档中引用的本地图片目录（截图、GIF）
├─ frontend/               # 前端应用（React + Vite）
│  ├─ index.html           # Vite 入口 HTML 模板
│  ├─ package.json         # 前端依赖与启动脚本（dev/build/preview）
│  ├─ vite.config.mts      # Vite 配置（插件、别名等）
│  ├─ postcss.config.js    # Tailwind / PostCSS 配置
│  ├─ tailwind.config.js   # Tailwind 配置
│  ├─ public/              # 静态公共资源（images/ 等，打包时会复制）
│  └─ src/                 # 前端源码
│     ├─ main.jsx          # React 挂载与路由（应用入口）
│     ├─ App.jsx           # 顶层组件：路由、数据加载与保存逻辑
│     ├─ index.css         # 全局样式（Tailwind 引导）
│     ├─ pages/            # 单页/路由组件
│     │  └─ Login.jsx      # 登录/注册页（支持用户名或邮箱登录、游客模式）
│     ├─ components/       # 可复用 UI 组件
│     │  ├─ Editor.jsx     # 编辑器主视图：表单、字段与“保存到云”交互
│     │  ├─ Preview.jsx    # 实时预览组件（根据 data 渲染页面外观）
│     │  └─ music/         # 音乐播放器相关组件与工具（audioUtils、播放列表、歌词解析）
│     ├─ utils/            # 工具函数
│     │  ├─ api.js         # axios 封装：baseURL、token 注入、401 处理
│     │  └─ generateZip.js # 将编辑结果导出为静态站点 ZIP 的逻辑
│     └─ ...               # 其他组件/样式/工具
├─ backend/                # 后端（可选）：Node.js + Express API
│  ├─ package.json         # 后端依赖与启动脚本（start）
│  ├─ server.js            # 主服务器文件：路由、JWT 验证、中间件、DB 连接池
│  ├─ .env.example         # 环境变量示例（PORT, DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET）
│  └─ migrations/          # （可选）数据库迁移脚本目录（建议加入以便版本化）
├─ legacy-templates/       # 旧版静态模板示例（可作为导出模板参考）
│  ├─ neo-portfolio.html
│  └─ personal-portfolio.html
└─ ...
```

简要说明（按关注点）：

- `frontend/package.json`：定义本地开发、构建、预览脚本，以及前端所需依赖（React、Vite、Tailwind 等）。
- `vite.config.mts`：配置 React 插件、路径别名等 Vite 级别设置，影响开发与构建流程。
- `src/main.jsx`：创建 React 根节点、设置路由（`/login`、`/editor` 等），并挂载到 DOM。
- `src/App.jsx`：应用主逻辑，包含从后端加载用户配置、合并到当前编辑器数据，并处理“保存到云端”的 POST 请求。
- `src/pages/Login.jsx`：处理登录/注册表单、客户端邮箱格式校验、调用 `/api/auth`，并将 JWT 与用户名保存到 `localStorage`。
- `src/utils/api.js`：axios 实例封装，自动把 `Authorization: Bearer <token>` 注入请求头，以及处理 401（清除 token 并跳转登录）。
- `src/utils/generateZip.js`：负责将当前编辑数据与静态模板合并并生成可下载的 ZIP 文件，用于离线部署。
- `backend/server.js`：实现注册（`/api/auth/register`）、登录（`/api/auth/login`）、配置读取/保存（`/api/config`）等接口；使用 `mysql2/promise` 连接池、`bcryptjs` 加密密码、`jsonwebtoken` 签发/验证 token。
- `backend/.env`（或 `.env.example`）：保存数据库连接信息与 `JWT_SECRET`，不要把实际凭据提交到公共仓库。
- `legacy-templates/`：保留旧版 HTML 模板，可作为生成静态站点时的参考或直接作为导出模板。

---

## 贡献与许可

欢迎提 Issue 与 PR。提交流程：Fork → 新分支 → 提交 → PR。

本项目采用 MIT 许可（详见 `LICENSE`）。