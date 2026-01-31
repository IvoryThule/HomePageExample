import axios from "axios";

const api = axios.create({
  // Use relative path so production build calls /api on same origin.
  // Nginx (or the web server) should proxy /api to the backend (http://127.0.0.1:3001).
  baseURL: "/api",
  timeout: 10000,
});

// 请求拦截器：自动注入 token
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// 响应拦截器：401 清理 token 并跳转登录
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      // 重定向到登录页（相对路径）
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
