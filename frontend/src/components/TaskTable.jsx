import { Link } from "react-router-dom";
import { formatDate, formatStatus, isOverdue } from "../utils/taskUtils";

export default function TaskTable({ tasks, onDelete, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th><th>Priority</th><th>Status</th><th>Deadline</th><th>Created</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <Link className="task-title" to={`/tasks/${task.id}`}>{task.title}</Link>
                {task.description && <span className="task-description">{task.description}</span>}
              </td>
              <td><span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
              <td>
                <select
                  className="status-select"
                  value={task.status}
                  onChange={(event) => onStatusChange?.(task.id, event.target.value)}
                  aria-label={`Status for ${task.title}`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </td>
              <td className={isOverdue(task) ? "overdue" : ""}>{formatDate(task.deadline)}</td>
              <td>{formatDate(task.createdAt)}</td>
              <td>
                <div className="row-actions">
                  <Link to={`/tasks/${task.id}`}>View</Link>
                  <Link to={`/tasks/${task.id}/edit`}>Edit</Link>
                  {onDelete && <button className="link-danger" onClick={() => onDelete(task.id)}>Delete</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
