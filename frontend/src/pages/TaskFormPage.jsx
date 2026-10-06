import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import TaskForm from "../components/TaskForm";
import Toast from "../components/Toast";
import { createTask, getApiError, getTask, updateTask } from "../services/api";

export default function TaskFormPage({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(edit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!edit) return;
    getTask(id).then((result) => setTask(result.data)).catch((err) => setToast(getApiError(err))).finally(() => setLoading(false));
  }, [edit, id]);

  const submit = async (payload) => {
    setSaving(true);
    try {
      if (edit) {
        await updateTask(id, payload);
        setToast("Task updated successfully.");
      } else {
        await createTask(payload);
        setToast("Task created successfully.");
      }
      setTimeout(() => navigate(edit ? `/tasks/${id}` : "/tasks"), 500);
    } catch (err) {
      setToast(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="narrow-page">
      <PageHeader title={edit ? "Edit Task" : "Create Task"} subtitle={edit ? "Update your task details." : "Add a new task to your workflow."} />
      {loading ? <div className="panel"><div className="empty-state">Loading task...</div></div> : task === null && edit ? <div className="error-state">{toast || "Task could not be found."}</div> : <TaskForm initialTask={task} submitting={saving} onSubmit={submit} onCancel={() => navigate(-1)} />}
      <Toast message={toast} onClose={() => setToast("")} />
    </section>
  );
}
