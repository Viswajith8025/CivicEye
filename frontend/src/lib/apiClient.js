import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  console.error("VITE_API_URL is not set. Add it to frontend/.env");
}

const api = axios.create({
  baseURL: baseURL || "http://localhost:5001",
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
