import { Platform } from "react-native";
 
// ── Chọn 1 trong 3 mode bên dưới ──────────────────────────────
const MODE = "ngrok"; // "local" | "ngrok" | "production"
// ──────────────────────────────────────────────────────────────
 
const URLS = {
  // Local: đổi IP khi đổi mạng
  local: Platform.OS === "web"
    ? "http://localhost:5000"
    : "http://192.168.1.194:5000",
 
  // Ngrok: copy URL từ terminal ngrok vào đây, không cần đổi IP
  ngrok: "https://unsizeable-cedrick-envyingly.ngrok-free.dev",
 
  // Production: URL cố định sau khi deploy
  production: "https://your-backend.railway.app",
};
 
const API_URL = URLS[MODE];
 
export default API_URL;
 