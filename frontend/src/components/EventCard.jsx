import LikeButton from "./LikeButton";
import TagChip from "./TagChip";

export default function EventCard({ event, onLike, onAction }) {
  return (
    <article className="event-card">
      <img src={event.coverImage} alt={event.title} className="event-cover" />
      <div className="event-card-body">
        <p className="muted">{event.society}</p>
        <h3>{event.title}</h3>
        <p>{event.date} • {event.venue}</p>
        <div className="tag-row">
          {event.tags?.map((tag) => <TagChip key={tag} label={tag} />)}
        </div>
        <div className="capacity-track">
          <div className="capacity-fill" style={{ width: `${Math.min(100, event.capacityPercent || 0)}%` }} />
        </div>
        <div className="card-actions">
          <LikeButton count={event.likes} liked={event.liked} onToggle={onLike} />
          <span>💬 {event.comments || 0}</span>
          <button onClick={() => onAction?.(event)}>{event.actionLabel || "View"}</button>
        </div>
      </div>
    </article>
  );
}
