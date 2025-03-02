import axios from "axios";
import store from "@/store/index";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const isToken = !!localStorage.getItem("access");
    const token = localStorage.getItem("access");
    if (token && isToken && token !== undefined && token !== null) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("access")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isRefreshToken = !!localStorage.getItem("refresh");
    const refreshToken = localStorage.getItem("refresh");
    if (
      error?.response?.status === 401 &&
      isRefreshToken &&
      refreshToken !== undefined &&
      refreshToken !== null
    ) {
      const errorConfig = error.config;
      if (errorConfig.url === "users/refresh/") {
        store.dispatch("logout");
        return Promise.reject(error);
      }
      await store.dispatch("refreshToken");
      return instance.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default instance;
