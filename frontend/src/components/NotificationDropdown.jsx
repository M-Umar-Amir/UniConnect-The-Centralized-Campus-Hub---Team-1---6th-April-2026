import { Link } from "react-router-dom";
import { resolveNotificationTarget } from "../utils/notificationTargets";

export default function NotificationDropdown({ notifications = [], unreadCount = 0, onMarkAllRead, onSelect }) {
  return (
    <section className="notification-dropdown">
      <header>
        <strong>Notifications</strong>
        {unreadCount > 0 && <button onClick={onMarkAllRead}>Mark all as read</button>}
      </header>
      <ul>
        {notifications.map((item) => (
          <li key={item._id || item.id}>
            <button onClick={() => onSelect?.({ ...item, targetUrl: resolveNotificationTarget(item) })}>
              <img src={item.actor?.avatarUrl || "https://placehold.co/40x40"} alt="avatar" />
              <span>{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
      <footer>
        <Link to="/notifications">View All Notifications</Link>
      </footer>
    </section>
  );
}
