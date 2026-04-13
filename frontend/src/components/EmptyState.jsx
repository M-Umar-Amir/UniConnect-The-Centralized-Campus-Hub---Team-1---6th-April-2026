export default function EmptyState({ heading, subtext, actionLabel, onAction }) {
  return (
    <section className="empty-state">
      <div className="empty-illustration" aria-hidden="true">◌</div>
      <h3>{heading}</h3>
      <p>{subtext}</p>
      {actionLabel && <button onClick={onAction}>{actionLabel}</button>}
    </section>
  );
}
