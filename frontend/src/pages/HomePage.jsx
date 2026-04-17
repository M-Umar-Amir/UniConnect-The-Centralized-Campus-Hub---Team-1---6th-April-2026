import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  LogOut,
  MapPin,
  MessageSquare,
  Rocket,
  Search,
  Send,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import {
  events,
  highlightItems,
  societyUpdates,
  startupItems,
  suggestedPeople
} from "../data/mockAppData";
import { getStoredProfile, logoutUser } from "../utils/session";

const quickLinks = [
  { label: "Home", to: "/home" },
  { label: "Search", to: "/search?q=campus" },
  { label: "Events", to: "/events" },
  { label: "Startups", to: "/startups" },
  { label: "Notifications", to: "/notifications" },
  { label: "Settings", to: "/settings" },
  { label: "My Profile", to: "/profile/me" }
];

const filters = ["All", "Events", "Highlights", "Startups", "Updates"];

function FeedLikeButton({ initialLikes, initialLiked = false }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  function toggleLike() {
    setLiked((current) => !current);
    setLikes((current) => (liked ? current - 1 : current + 1));
  }

  return (
    <button type="button" className={`home-action-button${liked ? " active" : ""}`} onClick={toggleLike}>
      <Heart size={16} />
      <span>{likes}</span>
    </button>
  );
}

function EventFeedCard({ item }) {
  return (
    <article className="feed-card home-feed-card">
      <img src={item.coverImage} alt={item.title} className="feed-card__image home-feed-card__image" />
      <div className="home-feed-card__top">
        <div>
          <p className="section-kicker">Event</p>
          <h3>{item.society}</h3>
          <p className="muted">{item.eventType}</p>
        </div>
        <button type="button" className="home-chip-button">
          <Bookmark size={15} />
          Save
        </button>
      </div>

      <div className="home-feed-card__body">
        <h4>{item.title}</h4>
        <p className="feed-card__text">{item.description}</p>
        <div className="tag-row">
          {item.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
        <div className="home-meta-grid">
          <div>
            <Clock size={15} />
            <span>
              {item.displayDate} · {item.time}
            </span>
          </div>
          <div>
            <MapPin size={15} />
            <span>{item.venue}</span>
          </div>
        </div>
        <div>
          <div className="row-between muted">
            <span>Capacity filled</span>
            <strong>{item.capacityPercent}%</strong>
          </div>
          <div className="capacity-track">
            <div className="capacity-fill" style={{ width: `${item.capacityPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="feed-card__actions home-feed-card__actions">
        <FeedLikeButton initialLikes={item.likes} initialLiked={item.liked} />
        <button type="button" className="home-action-button">
          <MessageSquare size={16} />
          <span>{item.comments}</span>
        </button>
        <button type="button" className="home-action-button">
          <Send size={16} />
          <span>Share</span>
        </button>
        <Link to={`/events/${item.id}`} className="primary-page-button">
          <Calendar size={16} />
          View Details
        </Link>
      </div>
    </article>
  );
}

function HighlightFeedCard({ item }) {
  return (
    <article className="feed-card home-feed-card">
      <img src={item.thumbnail} alt={item.eventName} className="feed-card__image home-feed-card__image" />
      <div className="home-feed-card__top">
        <div>
          <p className="section-kicker">Highlight</p>
          <h3>{item.society}</h3>
          <p className="muted">{item.eventName}</p>
        </div>
      </div>
      <div className="home-feed-card__body">
        <h4>Post-event highlight</h4>
        <p className="feed-card__text">{item.caption}</p>
      </div>
      <div className="feed-card__actions home-feed-card__actions">
        <FeedLikeButton initialLikes={item.likes} initialLiked={item.liked} />
        <button type="button" className="home-action-button">
          <MessageSquare size={16} />
          <span>{item.comments}</span>
        </button>
        <Link to={`/events/${item.eventId}`} className="primary-page-button">
          <Calendar size={16} />
          View Details
        </Link>
      </div>
    </article>
  );
}

function StartupFeedCard({ item }) {
  return (
    <article className="feed-card home-feed-card">
      <div className="home-feed-card__top">
        <div>
          <p className="section-kicker">Startup</p>
          <h3>{item.name}</h3>
          <p className="muted">Founded by {item.founder}</p>
        </div>
      </div>
      <div className="home-feed-card__body">
        <h4>{item.tagline}</h4>
        <p className="feed-card__text">{item.summary}</p>
        <div className="tag-row">
          {item.domains.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
        <div className="home-role-row">
          {item.rolesNeeded.map((role) => (
            <span key={role} className="status-chip">
              <Zap size={13} />
              {role}
            </span>
          ))}
        </div>
      </div>
      <div className="feed-card__actions home-feed-card__actions">
        <FeedLikeButton initialLikes={item.likes} initialLiked={item.liked} />
        <button type="button" className="home-action-button">
          <Send size={16} />
          <span>Share</span>
        </button>
        <Link to="/startups" className="primary-page-button">
          <Rocket size={16} />
          View Pitch
        </Link>
      </div>
    </article>
  );
}

function UpdateFeedCard({ item }) {
  return (
    <article className="feed-card home-feed-card">
      {item.image ? <img src={item.image} alt={item.author} className="feed-card__image home-feed-card__image" /> : null}
      <div className="home-feed-card__top">
        <div>
          <p className="section-kicker">Update</p>
          <h3>{item.author}</h3>
          <p className="muted">{item.timestamp}</p>
        </div>
      </div>
      <div className="home-feed-card__body">
        <h4>Society update</h4>
        <p className="feed-card__text">{item.text}</p>
      </div>
      <div className="feed-card__actions home-feed-card__actions">
        <FeedLikeButton initialLikes={item.likes} initialLiked={item.liked} />
        <button type="button" className="home-action-button">
          <MessageSquare size={16} />
          <span>{item.comments}</span>
        </button>
        <Link to="/events" className="primary-page-button">
          <Calendar size={16} />
          View Details
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const profile = getStoredProfile();

  const feedItems = useMemo(
    () => [
      ...events.slice(0, 2).map((event) => ({ ...event, type: "event" })),
      ...highlightItems.map((item) => ({ ...item, type: "highlight" })),
      ...startupItems.slice(0, 1).map((item) => ({ ...item, type: "startup" })),
      ...societyUpdates.map((item) => ({ ...item, type: "update" }))
    ],
    []
  );

  const filteredFeed = useMemo(() => {
    if (activeFilter === "All") {
      return feedItems;
    }

    const map = {
      Events: "event",
      Highlights: "highlight",
      Startups: "startup",
      Updates: "update"
    };

    return feedItems.filter((item) => item.type === map[activeFilter]);
  }, [activeFilter, feedItems]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="home-feed">
      <aside className="home-sidebar">
        <section className="profile-summary">
          <div className="profile-summary__avatar">{(profile.fullName || "Zara Ahmed")[0]}</div>
          <h2>{profile.fullName || "Zara Ahmed"}</h2>
          <p>
            {(profile.role || "student").replace("_", " ")} · {profile.university || "IBA Karachi"}
          </p>

          <div className="profile-summary__stats">
            <div>
              <strong>142</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>89</strong>
              <span>Following</span>
            </div>
          </div>

          <div className="profile-summary__tags">
            {(profile.interests?.length ? profile.interests : ["Hackathons", "Startups", "Design", "EdTech"]).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        <section className="side-panel">
          <h3>Workspace</h3>
          {quickLinks.map((item) => (
            <Link key={item.label} to={item.to} className="side-link home-side-link">
              <span>{item.label}</span>
              <ChevronRight size={15} />
            </Link>
          ))}
          <button type="button" className="side-link home-side-link" onClick={handleLogout}>
            <span>Logout</span>
            <LogOut size={15} />
          </button>
        </section>
      </aside>

      <main className="home-main">
        <section className="home-banner home-banner--feature">
          <div className="home-banner__header">
            <div>
              <p className="section-kicker">Homepage feed</p>
              <h1>What matters on campus this week.</h1>
              <p>
                A cleaner home for upcoming events, student updates, startup momentum, and the people you may want to
                meet next.
              </p>
            </div>
            <div className="home-banner__actions">
              <Link to="/search?q=campus" className="home-chip-button">
                <Search size={15} />
                Search
              </Link>
              <Link to="/notifications" className="home-chip-button">
                <Bell size={15} />
                Notifications
              </Link>
            </div>
          </div>

          <div className="event-strip event-strip--scroll">
            {events.slice(0, 4).map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="event-strip__card">
                <span className="section-kicker">{event.eventType}</span>
                <strong>{event.title}</strong>
                <p>{event.displayDate}</p>
                <p>{event.venue}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="home-filter-row">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`home-filter-button${activeFilter === filter ? " active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="feed-stack">
          {filteredFeed.map((item) => {
            if (item.type === "event") return <EventFeedCard key={item.id} item={item} />;
            if (item.type === "highlight") return <HighlightFeedCard key={item.id} item={item} />;
            if (item.type === "startup") return <StartupFeedCard key={item.id} item={item} />;
            return <UpdateFeedCard key={item.id} item={item} />;
          })}
        </section>
      </main>

      <aside className="home-rail">
        <section className="side-panel">
          <h3>Recommended events</h3>
          {events.slice(0, 3).map((item) => (
            <Link key={item.id} to={`/events/${item.id}`} className="home-rail-item home-rail-link">
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.displayDate} · {item.time}
                </p>
              </div>
              <span>{item.capacityPercent}% full</span>
            </Link>
          ))}
        </section>

        <section className="side-panel">
          <h3>Active societies</h3>
          {[
            { name: "Business Society", detail: "2 events this week" },
            { name: "Tech Council", detail: "Highlight posted today" },
            { name: "Media Society", detail: "Volunteer applications open" }
          ].map((item) => (
            <div key={item.name} className="home-rail-item">
              <div>
                <strong>{item.name}</strong>
                <p>{item.detail}</p>
              </div>
              <TrendingUp size={16} />
            </div>
          ))}
        </section>

        <section className="side-panel">
          <h3>Suggested people</h3>
          {suggestedPeople.map((person) => (
            <div key={person.id} className="home-person-row">
              <div className="home-person-row__avatar">{person.initials}</div>
              <div>
                <strong>{person.name}</strong>
                <p>{person.role}</p>
              </div>
              <Link to={`/profile/${person.id}`} className="home-chip-button">
                <Users size={15} />
                View
              </Link>
            </div>
          ))}
        </section>
      </aside>
    </div>
  );
}
