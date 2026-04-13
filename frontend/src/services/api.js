import axios from "axios";
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const api  = axios.create({ baseURL: BASE, headers: { "Content-Type": "application/json" } });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export const authAPI    = {
  login:    (email, password) => api.post("/auth/login",    { email, password }),
  register: (name, email, p)  => api.post("/auth/register", { name, email, password: p }),
  verify:   (token)           => api.post("/auth/verify",   { token }),
  googleUrl: () => `${BASE}/auth/google`
};
export const contentAPI = {
  getTrending: (limit) => api.get("/content/trending", { params: { limit } }),
  scrapeUrl:   (url)   => api.post("/content/scrape", { url })
};
export const videoAPI   = {
  generate:    (content, options) => api.post("/video/generate", { content, options }),
  list:        ()                 => api.get("/video"),
  remove:      (id)               => api.delete(`/video/${id}`)
};
export const socialAPI  = {
  getAccounts: ()                                    => api.get("/social/accounts"),
  connect:     (platform, data)                      => api.post("/social/connect", { platform, ...data }),
  disconnect:  (platform)                            => api.delete(`/social/${platform}`),
  publish:     (videoId, caption, platforms, sched)  => api.post("/social/publish", { videoId, caption, platforms, scheduledAt: sched }),
  scheduled:   ()                                    => api.get("/social/scheduled")
};
export const userAPI    = {
  profile:        ()       => api.get("/user/profile"),
  updateProfile:  (data)   => api.put("/user/profile", data),
  settings:       ()       => api.get("/user/settings"),
  updateSettings: (data)   => api.put("/user/settings", data)
};
export default api;
