import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://offerwell.vercel.app" // your production backend URL
    : "http://localhost:5000";       // local dev backend

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});
