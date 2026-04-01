import { getStoredToken } from "./storage";

// Use process.env.EXPO_PUBLIC_API_URL provided by Expo. Fallback is the hardcoded IP.
const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.7:3000/api";

const request = async (method: string, endpoint: string, data?: any) => {
  const token = await getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { response: { data: responseData, status: response.status } };
  }

  return { data: responseData };
};

const api = {
  get: (endpoint: string) => request("GET", endpoint),
  post: (endpoint: string, data?: any) => request("POST", endpoint, data),
  put: (endpoint: string, data?: any) => request("PUT", endpoint, data),
  delete: (endpoint: string) => request("DELETE", endpoint),
};

export default api;
