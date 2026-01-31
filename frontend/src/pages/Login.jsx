
import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

// 图标资源
const Icons = {
  User: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  Arrow: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
  Code: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // 初始化检查是否记住了用户名
  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // client-side email format validation for registration
      if (mode === "register") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("邮箱格式不正确");
          setLoading(false);
          return;
        }
      }

      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email, password } : { username, email, password };
      const res = await api.post(endpoint, body);
      const { token, username: loggedUsername } = res.data;

      if (mode === "register" && !token) {
        alert("注册成功，请登录");
        setMode("login");
      } else if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("loggedUsername", loggedUsername || username);

        if (rememberMe) {
          // remember login email
          localStorage.setItem("remembered_email", email);
        } else {
          localStorage.removeItem("remembered_email");
        }

        navigate("/editor");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "请求失败");
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUsername");
    navigate("/editor");
  };

  const handleForgotPassword = () => {
    alert("请联系管理员重置密码，或者稍后我们上线邮件找回功能。");
  };

  return (
    <div className="relative w-full h-screen bg-[#020202] overflow-hidden flex items-center justify-center font-sans">
      {/* 背景层 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: "url('../images/background/Iuno.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
      </div>

      {/* 主容器 */}
      <div className="relative z-10 w-full max-w-5xl h-[600px] flex rounded-3xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl">
        {/* 左侧：品牌区 */}
        <div className="hidden lg:flex w-5/12 relative flex-col justify-between p-10 border-r border-white/5 bg-black/20">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-600/80 backdrop-blur-md rounded-lg flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-900/50 border border-white/10">
              <Icons.Code />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
              VISUAL HOMEPAGE <br/> <span className="text-blue-400">BUILDER</span>
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed pt-4 font-medium drop-shadow-sm">
              几分钟内创建您的独特作品集。<br/>
              纯正玻璃拟态美学。
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-green-400 font-mono drop-shadow-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>系统已就绪</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 font-mono text-xs text-gray-400 backdrop-blur-sm">
              <p>&gt; 正在初始化 UI 引擎...</p>
              <p>&gt; 正在加载资源...</p>
              <p className="text-blue-400">&gt; 就绪，等待用户输入_</p>
            </div>
          </div>
        </div>

        {/* 右侧：交互区 */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
              {mode === 'login' ? '欢迎回来' : '加入我们'}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-300">
                {mode === 'login' ? '还没账号？' : '已有账号？'}
              </span>
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setPassword(''); }}
                className="text-blue-300 hover:text-blue-200 underline decoration-blue-400/30 underline-offset-4 transition-colors font-medium"
              >
                {mode === 'login' ? '立即注册' : '直接登录'}
              </button>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-5">
              <div className="group">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{mode === 'login' ? '邮箱' : '用户名'}</label>
                <div className="relative">
                  <input
                    required
                    type={mode === 'login' ? 'email' : 'text'}
                    value={mode === 'login' ? email : username}
                    onChange={(e) => mode === 'login' ? setEmail(e.target.value) : setUsername(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono text-sm backdrop-blur-sm caret-blue-500"
                    placeholder={mode === 'login' ? '输入邮箱' : '输入用户名'}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-blue-400 transition-colors">
                    <Icons.User />
                  </div>
                </div>
              </div>

              {mode === 'register' && (
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">邮箱</label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono text-sm backdrop-blur-sm caret-blue-500"
                      placeholder="输入邮箱"
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">密码</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono text-sm backdrop-blur-sm caret-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer outline-none p-1"
                    title={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-4 h-4 border border-white/20 rounded bg-white/5 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                    <svg className="absolute top-0.5 left-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors select-none">记住我</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  忘记密码？
                </button>
              </div>
            )}

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600/90 hover:bg-blue-500 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 backdrop-blur-sm border border-blue-500/50 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{mode === 'login' ? '登录' : '创建账号'}</span>
                    <Icons.Arrow />
                  </>
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider font-medium">或</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                type="button"
                onClick={continueAsGuest}
                className="w-full h-12 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 rounded-lg transition-all text-sm font-medium backdrop-blur-sm"
              >
                以游客身份继续
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 text-gray-500/80 text-xs font-mono drop-shadow-md">
        v2.0.0 &bull; 视觉主页构建器 &bull; React + Node.js
      </div>
    </div>
  );
}