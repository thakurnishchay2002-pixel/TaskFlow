export const formatStatus = (value) =>
  value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const formatDate = (value) => {
  if (!value) return "No deadline";
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
};

export const isOverdue = (task, now = new Date()) =>
  Boolean(task.deadline && new Date(task.deadline) < now && task.status !== "COMPLETED");

export const validateTask = (task) => {
  const errors = {};
  if (!task.title?.trim()) errors.title = "Title is required.";
  else if (task.title.trim().length > 120) errors.title = "Title must be 120 characters or less.";
  if ((task.description ?? "").length > 2000) errors.description = "Description must be 2000 characters or less.";
  if (!task.priority) errors.priority = "Priority is required.";
  if (!task.status) errors.status = "Status is required.";
  return errors;
};

export const emptyTask = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
  deadline: ""
};
