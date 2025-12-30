import axios from "axios";

const API_URL = "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Words API
export const wordsAPI = {
  add: (data) => api.post("/words/add", data),
  getMyWords: () => api.get("/words/my-words"),
  getById: (id) => api.get(`/words/${id}`),
  delete: (id) => api.delete(`/words/${id}`),
};

// Review API
export const reviewAPI = {
  getTodayWords: () => api.get("/review/today"),
  submit: (data) => api.post("/review/submit", data),
  getStats: () => api.get("/review/stats"),
};

// AI API
export const aiAPI = {
  generateQuiz: (data) => api.post("/ai/quiz", data),
  provideFeedback: (data) => api.post("/ai/feedback", data),
};

export default api;
