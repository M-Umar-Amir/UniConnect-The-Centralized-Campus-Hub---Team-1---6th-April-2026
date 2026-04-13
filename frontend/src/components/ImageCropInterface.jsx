export default function ImageCropInterface({ open, mode = "circle", imageUrl, onConfirm, onRecrop, onClose }) {
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <section className="modal">
        <h3>Crop Image</h3>
        <div className={`crop-preview ${mode}`}>
          <img src={imageUrl} alt="Crop preview" />
        </div>
        <div className="row-end">
          <button onClick={onRecrop}>Re-crop</button>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  );
}
