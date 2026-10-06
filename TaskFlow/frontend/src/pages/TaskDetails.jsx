import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import { deleteTask, getApiError, getTask, updateTaskStatus } from "../services/api";
import { formatDate, formatStatus, isOverdue } from "../utils/taskUtils";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    getTask(id).then((result) => setTask(result.data)).catch((err) => setError(getApiError(err)));
  }, [id]);

  const toggleComplete = async () => {
    try {
      const status = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      const result = await updateTaskStatus(id, status);
      setTask(result.data);
      setToast(status === "COMPLETED" ? "Task marked as completed." : "Task marked as pending.");
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  const remove = async () => {
    try {
      await deleteTask(id);
      navigate("/tasks");
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  if (error) return <section><div className="error-state">{error}</div><Link className="btn secondary" to="/tasks">Back to tasks</Link></section>;
  if (!task) return <section><div className="panel"><div className="empty-state">Loading task...</div></div></section>;

  return (
    <section className="narrow-page">
      <PageHeader title="Task Details" subtitle="Review the task and take action." action={<Link className="btn secondary" to="/tasks">Back</Link>} />
      <article className="detail-card">
        <div className="badge-row">
          <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
          <span className="badge status-badge">{formatStatus(task.status)}</span>
          {isOverdue(task) && <span className="badge overdue-badge">Overdue</span>}
        </div>
        <h2>{task.title}</h2>
        <p className="detail-description">{task.description || "No description provided."}</p>
        <div className="detail-grid">
          <div><span>Deadline</span><strong>{formatDate(task.deadline)}</strong></div>
          <div><span>Created</span><strong>{formatDate(task.createdAt)}</strong></div>
          <div><span>Last updated</span><strong>{formatDate(task.updatedAt)}</strong></div>
        </div>
        <div className="button-row">
          <button className="btn primary" onClick={toggleComplete}>{task.status === "COMPLETED" ? "Mark Pending" : "Mark Completed"}</button>
          <Link className="btn secondary" to={`/tasks/${id}/edit`}>Edit</Link>
          <button className="btn danger" onClick={() => setConfirm(true)}>Delete</button>
        </div>
      </article>
      <Toast message={toast} onClose={() => setToast("")} />
      <ConfirmDialog open={confirm} title="Delete task?" message="This action cannot be undone." onConfirm={remove} onCancel={() => setConfirm(false)} />
    </section>
  );
}
