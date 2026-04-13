export default function ConfirmationDialog({ open, title, warning, confirmLabel = "Confirm", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <section className="modal">
        <h3>{title}</h3>
        <p>{warning}</p>
        <div className="row-end">
          <button onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
