import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://electric-motorbike-prj-backend.vercel.app/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;