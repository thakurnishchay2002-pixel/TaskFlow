import { useCallback, useEffect, useState } from "react";
import { deleteTask, getApiError, listTasks, updateTaskStatus } from "../services/api";

const defaultFilters = {
  search: "",
  priority: "",
  status: "",
  deadline: "ALL",
  sortBy: "createdAt",
  direction: "desc"
};

export function useTasks(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const result = await listTasks(params);
      setTasks(result.data ?? []);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(load, 180);
    return () => clearTimeout(timer);
  }, [load]);

  const remove = async (id) => {
    await deleteTask(id);
    await load();
  };

  const changeStatus = async (id, status) => {
    await updateTaskStatus(id, status);
    await load();
  };

  return {
    tasks, loading, error, filters, setFilters, load, remove, changeStatus,
    reset: () => setFilters(defaultFilters)
  };
}
