// src/api/axios.js
// Central Axios instance for all API calls - Version 2.
// Automatically attaches the JWT token from localStorage to every request.

import axios from "axios";

console.log("Initializing CampusOS API...");

// In development: uses http://localhost:8000
// In production: uses the VITE_API_URL environment variable (set in Vercel)
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      if (window.location.port === "5173") {
        return "http://localhost:8000";
      }
      return window.location.origin;
    }
  }
  return "https://campusos1.onrender.com";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — adds the JWT token to every outgoing request
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — handles 401 errors globally (auto-logout)
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
