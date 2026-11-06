import api from "./api";

export const getStats = () => api.get("/users/me/stats").then((r) => r.data);
export const updateProfile = (payload) => api.patch("/users/me", payload).then((r) => r.data);
