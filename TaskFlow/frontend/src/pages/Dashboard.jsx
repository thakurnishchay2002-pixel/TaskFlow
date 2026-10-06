import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import TaskTable from "../components/TaskTable";
import LoadingState from "../components/LoadingState";
import { listTasks } from "../services/api";
import { isOverdue } from "../utils/taskUtils";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTasks({ sortBy: "createdAt", direction: "desc" })
      .then((result) => setTasks(result.data || []))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    overdue: tasks.filter(isOverdue).length
  }), [tasks]);

  return (
    <section>
      <PageHeader
        title="Dashboard"
        subtitle="A focused overview of your work."
        action={<Link className="btn primary" to="/tasks/new">+ New Task</Link>}
      />

      <div className="stats-grid">
        {[
          ["Total Tasks", stats.total, "all"],
          ["Pending", stats.pending, "pending"],
          ["In Progress", stats.inProgress, "progress"],
          ["Completed", stats.completed, "completed"],
          ["Overdue", stats.overdue, "overdue"]
        ].map(([label, value, tone]) => (
          <div className={`stat-card ${tone}`} key={label}>
            <span>{label}</span><strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <div><h2>Recent Tasks</h2><p>Your latest work at a glance.</p></div>
          <Link to="/tasks">View all</Link>
        </div>
        {loading ? <LoadingState /> : tasks.length ? <TaskTable tasks={tasks.slice(0, 6)} /> : <div className="empty-state">No tasks yet. Create your first task.</div>}
      </div>
    </section>
  );
}
