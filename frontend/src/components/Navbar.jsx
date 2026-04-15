import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar({ notifications = [], unreadCount = 0, onMarkAllRead, onOpenNotification }) {
  const [query, setQuery] = useState("");
  const [openBell, setOpenBell] = useState(false);
  const navigate = useNavigate();

  const mockResults = useMemo(() => {
    if (!query.trim()) return [];
    return [
      { id: "events", label: `Search events for \"${query}\"`, to: "/events" },
      { id: "startups", label: `Search startups for \"${query}\"`, to: "/startups" },
      { id: "users", label: `Search people for \"${query}\"`, to: `/profile/me?query=${encodeURIComponent(query)}` }
    ];
  }, [query]);

  useEffect(() => {
    function onOutsideClick() {
      setOpenBell(false);
    }

    if (openBell) {
      window.addEventListener("click", onOutsideClick);
      return () => window.removeEventListener("click", onOutsideClick);
    }
  }, [openBell]);

  return (
    <nav className="navbar">
      <Link to="/home" className="logo">UniConnect</Link>
      <div className="search-shell" onClick={(e) => e.stopPropagation()}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, startups, people"
        />
        {mockResults.length > 0 && (
          <ul className="search-dropdown">
            {mockResults.map((result) => (
              <li key={result.id}>
                 <button onClick={() => {
                   navigate(result.to);
                   setQuery("");
                 }}>{result.label}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="nav-actions" onClick={(e) => e.stopPropagation()}>
        <button className="bell-btn" onClick={() => setOpenBell((value) => !value)}>
          🔔 {unreadCount > 0 ? <span className="dot" /> : null}
        </button>
        {openBell && (
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllRead={onMarkAllRead}
            onSelect={onOpenNotification}
          />
        )}
        <button className="avatar-menu" onClick={() => navigate("/settings")}>👤</button>
      </div>
    </nav>
  );
}
