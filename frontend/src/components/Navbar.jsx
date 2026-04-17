import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import ULogo from "../assets/ULogo.png";
import { getStoredProfile, logoutUser } from "../utils/session";

const SEARCH_INDEX = {
  events: [
    "Hackathon Launch Night",
    "Founder Meetup",
    "Design Critique Session"
  ],
  users: [
    "Areeba Khan",
    "Hamza Ali",
    "Sara Tariq"
  ],
  startups: [
    "StudySync",
    "CampusCart",
    "PitchPilot"
  ]
};

export default function Navbar({ notifications = [], unreadCount = 0, onMarkAllRead, onOpenNotification }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = getStoredProfile();

  const groupedResults = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return [];
    }

    return Object.entries(SEARCH_INDEX)
      .map(([group, items]) => ({
        group,
        items: items.filter((item) => item.toLowerCase().includes(term)).slice(0, 3)
      }))
      .filter((entry) => entry.items.length > 0);
  }, [query]);

  useEffect(() => {
    setBellOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleOutsideClick() {
      setBellOpen(false);
      setMenuOpen(false);
    }

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  function submitSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <nav className="app-navbar">
      <div className="app-navbar__left">
        <Link to="/home" className="app-navbar__logo">
          <span className="app-navbar__logo-mark">
            <img src={ULogo} alt="UniConnect logo" />
          </span>
          <strong>UniConnect</strong>
        </Link>
      </div>

      <form className="app-navbar__search" onSubmit={submitSearch} onClick={(event) => event.stopPropagation()}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search events, users, startups"
        />
        <button type="submit">Search</button>

        {groupedResults.length > 0 ? (
          <div className="app-search-dropdown">
            {groupedResults.map((group) => (
              <section key={group.group} className="app-search-dropdown__group">
                <p>{group.group}</p>
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(item)}`);
                      setQuery("");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </section>
            ))}
          </div>
        ) : null}
      </form>

      <div className="app-navbar__actions" onClick={(event) => event.stopPropagation()}>
        <button className="app-icon-button" type="button" onClick={() => setBellOpen((current) => !current)}>
          <span>Notifications</span>
          {unreadCount > 0 ? <em>{unreadCount}</em> : null}
        </button>
        {bellOpen ? (
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllRead={onMarkAllRead}
            onSelect={onOpenNotification}
          />
        ) : null}

        <div className="app-profile-menu">
          <button className="app-avatar-button" type="button" onClick={() => setMenuOpen((current) => !current)}>
            <span className="app-avatar-button__avatar">
              {profile.avatarPreview ? <img src={profile.avatarPreview} alt="Profile avatar" /> : (profile.fullName || "U")[0]}
            </span>
            <span className="app-avatar-button__meta">
              <strong>{profile.fullName || "Campus User"}</strong>
              <small>{profile.role || "student"}</small>
            </span>
          </button>

          {menuOpen ? (
            <div className="app-profile-dropdown">
              <button type="button" onClick={() => navigate("/profile/me")}>
                My Profile
              </button>
              <button type="button" onClick={() => navigate("/settings")}>
                Settings
              </button>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
