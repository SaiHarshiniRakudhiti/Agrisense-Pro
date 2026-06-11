import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE, timeout: 30000 });

// Attach token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("agrisense_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Global error handling
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("agrisense_token");
      localStorage.removeItem("agrisense_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (d) => api.post("/api/v1/auth/register", d),
  login:    (d) => api.post("/api/v1/auth/login", d),
  me:       ()  => api.get("/api/v1/auth/me"),
};
export const cropAPI = {
  recommend: (d) => api.post("/api/v1/crop/recommend", d),
};
export const yieldAPI = {
  predict: (d) => api.post("/api/v1/yield/predict", d),
};
export const fertAPI = {
  advise: (d) => api.post("/api/v1/fertilizer/advise", d),
};
export const marketAPI = {
  prices:    ()    => api.get("/api/v1/market/prices"),
  cropPrice: (c)   => api.get(`/api/v1/market/prices/${c}`),
};
export const analyticsAPI = {
  dashboard:      () => api.get("/api/v1/analytics/dashboard"),
  seasonCalendar: () => api.get("/api/v1/analytics/season-calendar"),
  soilGuide:      () => api.get("/api/v1/analytics/soil-guide"),
};
export default api;