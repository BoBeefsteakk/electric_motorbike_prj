import axios from "axios";
import { Platform } from "react-native";

// Đồng bộ với apis.js — đổi MODE ở đây hoặc import trực tiếp API_URL
const MODE = "local"; // "local" | "ngrok" | "production"

const URLS: Record<string, string> = {
  local:
    Platform.OS === "web"
      ? "http://localhost:5000"
      : "http://192.168.1.194:5000",
  ngrok: "https://your-ngrok-url.ngrok-free.app",
  production: "https://your-backend.railway.app",
};

const axiosClient = axios.create({
  baseURL: `${URLS[MODE]}/api`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosClient;
