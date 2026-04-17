import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { notificationService } from "../services/notificationService";
import { resolveNotificationTarget } from "../utils/notificationTargets";

export default function AppLayout() {
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  async function loadRecent() {
    try {
      const payload = await notificationService.getRecent(8);
      setRecentNotifications(payload.items || []);
      setUnreadCount(payload.unreadCount || 0);
    } catch (error) {
      setRecentNotifications([]);
      setUnreadCount(0);
    }
  }

  useEffect(() => {
    loadRecent();
  }, []);

  return (
    <div className="app-shell">
      <Navbar
        notifications={recentNotifications}
        unreadCount={unreadCount}
        onMarkAllRead={async () => {
          await notificationService.markAllRead();
          loadRecent();
        }}
        onOpenNotification={async (item) => {
          await notificationService.markAsRead(item._id || item.id);
          navigate(resolveNotificationTarget(item));
        }}
      />
      <main className="page-wrap page-wrap--home">
        <Outlet />
      </main>
    </div>
  );
}
