import axios from "axios";
import { getStoredToken } from "./storage";
import { Platform } from "react-native";

// Use process.env.api if available, otherwise fallback to localhost:5000
// Note: Android emulator uses 10.0.2.2 to access localhost
let baseURL = "http://localhost:5000/api";
if (process.env.api) {
  baseURL = process.env.api.startsWith("http") ? `${process.env.api}/api` : `http://${process.env.api}/api`;
} else if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:5000/api";
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
