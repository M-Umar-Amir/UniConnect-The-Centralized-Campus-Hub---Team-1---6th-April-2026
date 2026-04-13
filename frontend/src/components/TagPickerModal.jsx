import TagChip from "./TagChip";

export default function TagPickerModal({ open, tags = [], selected = [], onSelect, onDone, onClose }) {
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <section className="modal">
        <header>
          <h3>Pick Tags</h3>
          <button onClick={onClose}>×</button>
        </header>
        <div className="tag-row">
          {tags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              selectable
              selected={selected.includes(tag)}
              onClick={() => onSelect?.(tag)}
            />
          ))}
        </div>
        <footer>
          <button onClick={onDone}>Done</button>
        </footer>
      </section>
    </div>
  );
}
