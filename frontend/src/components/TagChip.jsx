export default function TagChip({ label, selected = false, selectable = false, onClick }) {
  return (
    <button
      type="button"
      className={`tag-chip ${selected ? "selected" : ""} ${selectable ? "selectable" : "display-only"}`}
      onClick={onClick}
      disabled={!selectable}
    >
      {label}
    </button>
  );
}
