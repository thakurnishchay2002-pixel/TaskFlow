import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" }
});

const unwrap = (request) => request.then((response) => response.data);

export const listTasks = (params) => unwrap(api.get("/tasks", { params }));
export const getTask = (id) => unwrap(api.get(`/tasks/${id}`));
export const createTask = (task) => unwrap(api.post("/tasks", task));
export const updateTask = (id, task) => unwrap(api.put(`/tasks/${id}`, task));
export const updateTaskStatus = (id, status) => unwrap(api.patch(`/tasks/${id}/status`, { status }));
export const deleteTask = (id) => unwrap(api.delete(`/tasks/${id}`));

export const getApiError = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";

export default api;
