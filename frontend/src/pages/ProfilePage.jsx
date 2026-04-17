import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FollowersFollowingModal from "../components/FollowersFollowingModal";
import RoleBadge from "../components/RoleBadge";
import VerifiedBadge from "../components/VerifiedBadge";
import { events, getProfileById, startupItems, suggestedPeople } from "../data/mockAppData";

const tabs = ["Activity", "Events", "Startups", "Liked Posts"];

function getStoredId() {
  return "me";
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { id = "me" } = useParams();
  const profile = useMemo(() => getProfileById(id), [id]);
  const isOwner = id === "me" || id === getStoredId();
  const [activeTab, setActiveTab] = useState("Activity");
  const [modalType, setModalType] = useState(null);
  const [connections, setConnections] = useState(
    suggestedPeople.map((person) => ({ ...person, id: person.id, following: person.following }))
  );

  const attendedEvents = events.slice(0, 3);
  const ownedStartups = startupItems.slice(0, 2);

  return (
    <section className="page-container">
      <div className="content-card profile-page">
        <div className="profile-cover" />
        <div className="profile-header">
          <div className="profile-avatar-lg">{profile.name[0]}</div>
          <div className="profile-header__copy">
            <div className="profile-header__title">
              <h1>{profile.name}</h1>
              <RoleBadge role={profile.role.toLowerCase()} />
              <VerifiedBadge verified={profile.verified} />
            </div>
            <p>
              {profile.university} · {profile.year}
            </p>
            <p>{profile.bio}</p>
            <div className="tag-row">
              {profile.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
            <div className="profile-links">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <div className="profile-header__actions">
            {isOwner ? (
              <button type="button" className="primary-page-button" onClick={() => navigate("/profile/edit")}>
                Edit Profile
              </button>
            ) : (
              <>
                <button type="button" className="primary-page-button">
                  Follow
                </button>
                <button type="button">Message</button>
              </>
            )}
          </div>
        </div>

        <div className="profile-stats-bar">
          <button type="button" onClick={() => setModalType("followers")}>
            <strong>{profile.followers}</strong>
            <span>Followers</span>
          </button>
          <button type="button" onClick={() => setModalType("following")}>
            <strong>{profile.following}</strong>
            <span>Following</span>
          </button>
          <div>
            <strong>{profile.eventsAttended}</strong>
            <span>Events attended</span>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Activity" ? (
        <div className="content-card">
          <h2>Public Activity</h2>
          <div className="event-detail-list">
            <div className="event-detail-list__item">
              <strong>Registered for Campus Founder Mixer</strong>
              <p>Staying active in startup and networking events this week.</p>
            </div>
            <div className="event-detail-list__item">
              <strong>Liked a Tech Council highlight</strong>
              <p>Keeping up with product demo activity on campus.</p>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "Events" ? (
        <div className="content-card">
          <h2>Registered / Attended Events</h2>
          <div className="event-detail-list">
            {attendedEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="event-detail-list__item profile-list-link">
                <strong>{event.title}</strong>
                <p>
                  {event.displayDate} · <span className="status-chip">{event.status}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "Startups" ? (
        <div className="content-card">
          <h2>Startup Involvement</h2>
          <div className="search-results-grid">
            {ownedStartups.map((startup) => (
              <div key={startup.id} className="content-card search-item-card">
                <strong>{startup.name}</strong>
                <p>{startup.summary}</p>
                <div className="tag-row">
                  {startup.domains.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "Liked Posts" && isOwner ? (
        <div className="content-card">
          <h2>Liked Posts</h2>
          <p>Your saved likes and reactions will appear here.</p>
        </div>
      ) : null}

      <FollowersFollowingModal
        open={Boolean(modalType)}
        title={modalType === "followers" ? "Followers" : "Following"}
        users={connections}
        onClose={() => setModalType(null)}
        onToggleFollow={(user) =>
          setConnections((current) =>
            current.map((item) => (item.id === user.id ? { ...item, following: !item.following } : item))
          )
        }
      />
    </section>
  );
}
