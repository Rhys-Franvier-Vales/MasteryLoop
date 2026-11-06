import axios from "axios";

export const TOKEN_KEY = "ml_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the login token to every request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server says our session is invalid (expired token), send the user to log in again.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthForm = url.startsWith("/auth/login") || url.startsWith("/auth/register");
    if (err.response?.status === 401 && localStorage.getItem(TOKEN_KEY) && !isAuthForm) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

// Turns any failed request into a message that is safe to show the user.
export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Can't reach the server. Is the backend running?";
  return fallback;
}

export default api;
