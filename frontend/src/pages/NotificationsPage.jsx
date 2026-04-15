import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";
import { notificationService } from "../services/notificationService";
import { resolveNotificationTarget } from "../utils/notificationTargets";

const filters = ["all", "likes", "comments", "follows", "events", "startups", "announcements"];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadList(filter = activeFilter) {
    setLoading(true);
    try {
      const payload = await notificationService.getNotifications(filter);
      setNotifications(payload.items || []);
      setUnreadCount(payload.unreadCount || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList(activeFilter);
  }, [activeFilter]);

  async function handleRowClick(item) {
    await notificationService.markAsRead(item._id || item.id);
    navigate(resolveNotificationTarget(item));
  }

  return (
    <section>
      <header className="row-between notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && <button onClick={async () => { await notificationService.markAllRead(); loadList(); }}>Mark All as Read</button>}
      </header>

      <div className="filter-tabs">
        {filters.map((filter) => (
          <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>
            {filter}
          </button>
        ))}
      </div>

      {loading && <SkeletonCard lines={5} />}

      {!loading && notifications.length === 0 && (
        <EmptyState heading="No notifications yet" subtext="When someone interacts with your content, it will show up here." />
      )}

      {!loading && notifications.length > 0 && (
        <ul className="notification-list">
          {notifications.map((item) => (
            <li key={item._id || item.id}>
              <button className="notification-row" onClick={() => handleRowClick(item)}>
                <img src={item.actor?.avatarUrl || "https://placehold.co/44x44"} alt="avatar" />
                <div>
                  <p>{item.text}</p>
                  <span className="muted">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                {item.referenceThumbnail ? <img src={item.referenceThumbnail} alt="reference" className="thumb" /> : null}
                {!item.isRead ? <span className="unread-dot" /> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
