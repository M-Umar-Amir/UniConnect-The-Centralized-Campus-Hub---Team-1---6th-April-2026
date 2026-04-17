import { Link } from "react-router-dom";
import ULogo from "../assets/ULogo.png";

const NAV_ITEMS = [
  { id: "home", label: "Overview", to: "/home" },
  { id: "events", label: "Events", to: "/events" },
  { id: "startups", label: "Startups", to: "/startups" },
  { id: "profile", label: "Profile", to: "/profile/me" }
];

function getStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem("uniconnect_user_profile") || "{}");
  } catch {
    return {};
  }
}

export default function AppWorkspaceSidebar({ active }) {
  const profile = getStoredProfile();
  const interests = (profile.interests || ["Product", "Community", "Design"]).slice(0, 4);

  return (
    <aside className="workspace-sidebar">
      <div className="workspace-sidebar__brand">
        <span className="workspace-sidebar__mark">
          <img src={ULogo} alt="UniConnect logo" />
        </span>
        <div>
          <strong>UniConnect</strong>
          <span>Campus workspace</span>
        </div>
      </div>

      <div className="workspace-sidebar__section">
        <p className="workspace-sidebar__label">Navigate</p>
        <nav className="workspace-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`workspace-sidebar__link${active === item.id ? " active" : ""}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="workspace-sidebar__section workspace-sidebar__section--profile">
        <div className="workspace-sidebar__user">
          <div className="workspace-sidebar__avatar">
            {profile.avatarPreview ? (
              <img src={profile.avatarPreview} alt="Profile avatar" />
            ) : (
              (profile.fullName || "U")[0]
            )}
          </div>
          <div>
            <strong>{profile.fullName || "Campus User"}</strong>
            <p>{profile.role || "student"}</p>
          </div>
        </div>
        <div className="workspace-sidebar__stats">
          <div>
            <strong>142</strong>
            <span>Followers</span>
          </div>
          <div>
            <strong>18</strong>
            <span>Saved</span>
          </div>
        </div>
      </div>

      <div className="workspace-sidebar__section">
        <p className="workspace-sidebar__label">Interests</p>
        <div className="workspace-sidebar__chips">
          {interests.map((interest) => (
            <span key={interest}>{interest}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
