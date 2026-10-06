import { useEffect, useState } from "react";
import { emptyTask, validateTask } from "../utils/taskUtils";

export default function TaskForm({ initialTask, submitting, onSubmit, onCancel }) {
  const [task, setTask] = useState(emptyTask);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setTask({
        ...initialTask,
        deadline: initialTask.deadline ? initialTask.deadline.slice(0, 16) : ""
      });
    }
  }, [initialTask]);

  const update = (field, value) => {
    setTask((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const validationErrors = validateTask(task);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    onSubmit({ ...task, title: task.title.trim(), deadline: task.deadline || null });
  };

  return (
    <form className="task-form" onSubmit={submit} noValidate>
      <div className="form-field full">
        <label htmlFor="title">Title <span>*</span></label>
        <input id="title" value={task.title} onChange={(e) => update("title", e.target.value)} maxLength={120} />
        {errors.title && <small className="field-error">{errors.title}</small>}
      </div>

      <div className="form-field full">
        <label htmlFor="description">Description</label>
        <textarea id="description" rows="6" value={task.description || ""} onChange={(e) => update("description", e.target.value)} maxLength={2000} />
        {errors.description && <small className="field-error">{errors.description}</small>}
      </div>

      <div className="form-field">
        <label htmlFor="priority">Priority <span>*</span></label>
        <select id="priority" value={task.priority} onChange={(e) => update("priority", e.target.value)}>
          <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="status">Status <span>*</span></label>
        <select id="status" value={task.status} onChange={(e) => update("status", e.target.value)}>
          <option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="deadline">Deadline</label>
        <input id="deadline" type="datetime-local" value={task.deadline || ""} onChange={(e) => update("deadline", e.target.value)} />
      </div>

      <div className="form-actions full">
        <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
        <button className="btn primary" disabled={submitting}>{submitting ? "Saving..." : initialTask ? "Save Changes" : "Create Task"}</button>
      </div>
    </form>
  );
}
