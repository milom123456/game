import axios from "axios";  // 🔑 import না থাকলে error হবে

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" }
});
