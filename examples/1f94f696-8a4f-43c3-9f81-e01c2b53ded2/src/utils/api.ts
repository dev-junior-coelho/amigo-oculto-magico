import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-App-Id": "app-4olwshyixb0h"
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器，处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API 请求错误:", error);
    if (error.response?.data?.status === 999) {
      throw new Error(error.response.data.msg || "请求失败");
    }
    return Promise.reject(error);
  }
);

// API 统一方法封装
const api = {
  // 提交表单数据
  submitForm: (data: Record<string, string>) => 
    apiClient.post("/api/miaoda/runtime/apicenter/source/proxy/1qn3BFK7gbiEJcYESPDChc", data, {
      params: {
        formId: "form-4olwshyixb0h",
        appId: "app-4olwshyixb0h"
      }
    }),
};

export default api;