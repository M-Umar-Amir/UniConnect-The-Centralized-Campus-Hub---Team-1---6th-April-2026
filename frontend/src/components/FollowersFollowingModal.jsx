export default function FollowersFollowingModal({ open, title, users = [], onClose, onToggleFollow }) {
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <section className="modal">
        <header>
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </header>
        <input placeholder="Search users" />
        <ul>
          {users.map((user) => (
            <li key={user.id} className="row-between">
              <span>{user.name}</span>
              <button onClick={() => onToggleFollow?.(user)}>{user.following ? "Unfollow" : "Follow"}</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
