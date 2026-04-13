export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card" aria-busy="true">
      {Array.from({ length: lines }).map((_, idx) => (
        <span key={idx} className="skeleton-line" />
      ))}
    </div>
  );
}
