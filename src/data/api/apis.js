import { Platform } from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : "http://192.168.56.102:5000";

export default API_URL;