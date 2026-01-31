import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
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
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
