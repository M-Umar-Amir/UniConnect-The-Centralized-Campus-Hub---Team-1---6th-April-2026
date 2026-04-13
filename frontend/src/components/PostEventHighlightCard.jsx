import LikeButton from "./LikeButton";

export default function PostEventHighlightCard({ item, onLike, onOpen }) {
  return (
    <article className="highlight-card" onClick={() => onOpen?.(item)}>
      <img src={item.thumbnail} alt={item.caption} />
      <div>
        <p>{item.caption}</p>
        <p className="muted">{item.eventName} • {item.society}</p>
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <LikeButton count={item.likes} liked={item.liked} onToggle={onLike} />
          <span>💬 {item.comments || 0}</span>
        </div>
      </div>
    </article>
  );
}
