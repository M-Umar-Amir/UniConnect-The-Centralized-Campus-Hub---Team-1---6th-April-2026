import LikeButton from "./LikeButton";
import TagChip from "./TagChip";

export default function StartupCard({ startup, onLike, onViewPitch }) {
  return (
    <article className="startup-card">
      <h3>{startup.name}</h3>
      <p className="muted">Founder: {startup.founder}</p>
      <p>{startup.tagline}</p>
      <div className="tag-row">
        {startup.domains?.map((item) => <TagChip key={item} label={item} />)}
      </div>
      <div className="tag-row">
        {startup.rolesNeeded?.map((item) => <TagChip key={item} label={item} />)}
      </div>
      <div className="card-actions">
        <LikeButton count={startup.likes} liked={startup.liked} onToggle={onLike} />
        <button onClick={() => onViewPitch?.(startup)}>View Pitch</button>
      </div>
    </article>
  );
}
