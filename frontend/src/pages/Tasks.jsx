import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import TaskTable from "../components/TaskTable";
import LoadingState from "../components/LoadingState";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { useTasks } from "../hooks/useTasks";
import { getApiError } from "../services/api";

export default function Tasks() {
  const { tasks, loading, error, filters, setFilters, remove, changeStatus, reset } = useTasks();
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));

  const confirmDelete = async () => {
    try {
      await remove(deleteId);
      setToast("Task deleted successfully.");
    } catch (err) {
      setToast(getApiError(err));
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await changeStatus(id, status);
      setToast("Task status updated successfully.");
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  return (
    <section>
      <PageHeader
        title="All Tasks"
        subtitle="Search, filter, sort and manage your tasks."
        action={<Link className="btn primary" to="/tasks/new">+ New Task</Link>}
      />

      <div className="filter-bar">
        <input
          aria-label="Search tasks"
          placeholder="Search title or description..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        <select value={filters.priority} onChange={(e) => updateFilter("priority", e.target.value)}>
          <option value="">All priorities</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
        </select>
        <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
          <option value="">All statuses</option><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option>
        </select>
        <select value={filters.deadline} onChange={(e) => updateFilter("deadline", e.target.value)}>
          <option value="ALL">All deadlines</option><option value="OVERDUE">Overdue</option><option value="TODAY">Today</option><option value="UPCOMING">Upcoming</option><option value="NO_DEADLINE">No deadline</option>
        </select>
        <select value={filters.sortBy} onChange={(e) => updateFilter("sortBy", e.target.value)}>
          <option value="createdAt">Created</option><option value="deadline">Deadline</option><option value="title">Title</option><option value="priority">Priority</option>
        </select>
        <button className="btn secondary" onClick={() => updateFilter("direction", filters.direction === "desc" ? "asc" : "desc")}>
          {filters.direction === "desc" ? "↓ Desc" : "↑ Asc"}
        </button>
        <button className="btn ghost" onClick={reset}>Clear</button>
      </div>

      <div className="panel">
        {loading ? <LoadingState /> : error ? <div className="error-state">{error}</div> : tasks.length ? <TaskTable tasks={tasks} onDelete={setDeleteId} onStatusChange={handleStatus} /> : <div className="empty-state">No tasks match your filters.</div>}
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete task?"
        message="This action cannot be undone. Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </section>
  );
}
