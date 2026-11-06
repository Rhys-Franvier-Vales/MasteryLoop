import api from "./api";

export const getQuestion = (nodeId) => api.get(`/attempts/question/${nodeId}`).then((r) => r.data);
export const submit = (payload) => api.post("/attempts", payload).then((r) => r.data);
