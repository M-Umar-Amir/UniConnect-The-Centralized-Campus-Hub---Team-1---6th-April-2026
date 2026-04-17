import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import { events } from "../data/mockAppData";

const tagOptions = ["All", "Hackathon", "Startup", "Media", "Networking", "Expo", "Community"];
const statusOptions = ["All", "upcoming", "ongoing", "past"];
const typeOptions = ["All", "Networking", "Hackathon", "Showcase", "Summit"];

function getStoredRole() {
  try {
    return JSON.parse(localStorage.getItem("uniconnect_user_profile") || "{}").role || "student";
  } catch {
    return "student";
  }
}

function EventListRow({ event }) {
  return (
    <article className="event-list-row">
      <img src={event.coverImage} alt={event.title} />
      <div className="event-list-row__body">
        <div className="event-list-row__top">
          <div>
            <p>{event.society}</p>
            <h3>{event.title}</h3>
          </div>
          <span className="status-chip">{event.status}</span>
        </div>
        <p className="event-list-row__description">{event.description}</p>
        <div className="tag-row">
          {event.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
        <div className="event-list-row__meta">
          <span>
            {event.displayDate} · {event.time}
          </span>
          <span>{event.venue}</span>
          <Link to={`/events/${event.id}`} className="primary-page-button">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [view, setView] = useState("grid");
  const role = getStoredRole();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesQuery =
        !query ||
        [event.title, event.society, event.description, event.eventType, ...event.tags].some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        );

      const matchesTag = selectedTag === "All" || event.tags.includes(selectedTag);
      const matchesStatus = selectedStatus === "All" || event.status === selectedStatus;
      const matchesType = selectedType === "All" || event.eventType === selectedType;

      return matchesQuery && matchesTag && matchesStatus && matchesType;
    });
  }, [query, selectedTag, selectedStatus, selectedType]);

  return (
    <section className="events-page">
      <header className="events-hero">
        <div>
          <p className="section-kicker">Event Discovery</p>
          <h1>Find campus events worth showing up for</h1>
          <p>Browse by format, society, or status without digging through clutter.</p>
        </div>
        {role === "event_manager" ? (
          <Link to="/events/create" className="primary-page-button">
            Create Event
          </Link>
        ) : null}
      </header>

      <section className="events-toolbar">
        <div className="events-toolbar__search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, society, or tag"
          />
        </div>
        <div className="events-toolbar__filters">
          <select value={selectedTag} onChange={(event) => setSelectedTag(event.target.value)}>
            {tagOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="view-toggle">
            <button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
              Grid
            </button>
            <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
              List
            </button>
          </div>
        </div>
      </section>

      {filteredEvents.length === 0 ? (
        <section className="empty-page-state">
          <h2>No events found</h2>
          <p>Try another keyword or relax a filter to see more results.</p>
        </section>
      ) : view === "grid" ? (
        <section className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={{ ...event, date: `${event.displayDate} · ${event.time}`, actionLabel: "View Details" }}
              onLike={() => Promise.resolve()}
              onAction={(selectedEvent) => navigate(`/events/${selectedEvent.id}`)}
            />
          ))}
        </section>
      ) : (
        <section className="events-list">
          {filteredEvents.map((event) => (
            <EventListRow key={event.id} event={event} />
          ))}
        </section>
      )}
    </section>
  );
}
