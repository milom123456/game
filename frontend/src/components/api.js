import axios from "axios";

export const api = axios.create({
  baseURL: "https://game-production-3ffe.up.railway.app",
  headers: {
    "Content-Type": "application/json"
  }
});
