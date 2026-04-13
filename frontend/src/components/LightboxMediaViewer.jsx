export default function LightboxMediaViewer({ open, items = [], index = 0, onPrev, onNext, onClose }) {
  if (!open || items.length === 0) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose}>×</button>
      <button className="lightbox-prev" onClick={onPrev}>←</button>
      <img src={items[index]} alt="Media viewer" className="lightbox-media" />
      <button className="lightbox-next" onClick={onNext}>→</button>
    </div>
  );
}
