export default function ToastNotifications({ toasts = [], onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast ${toast.type}`}>
          <p>{toast.message}</p>
          <button onClick={() => onDismiss?.(toast.id)}>×</button>
        </article>
      ))}
    </div>
  );
}
