export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>
      {onClose && <button onClick={onClose} aria-label="Close notification">×</button>}
    </div>
  );
}
