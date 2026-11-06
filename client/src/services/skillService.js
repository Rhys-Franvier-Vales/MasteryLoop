import api from "./api";

export const getTree = () => api.get("/skills").then((r) => r.data);
export const getDue = () => api.get("/skills/due").then((r) => r.data);
