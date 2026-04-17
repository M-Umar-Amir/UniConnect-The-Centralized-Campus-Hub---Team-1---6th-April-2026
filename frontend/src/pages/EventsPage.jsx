import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import { eventService } from "../services/eventService";

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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [view, setView] = useState("grid");
  const role = getStoredRole();

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setLoadError("");
        const payload = await eventService.list(query);
        const items = payload.items || [];
        setEvents(
          items.map((event) => ({
            id: event._id,
            coverImage: event.coverImage || "https://placehold.co/640x360?text=Event",
            society: event.society || event.organizer?.fullName || "Campus Society",
            title: event.title,
            description: event.description || "",
            eventType: event.eventType || "General",
            tags: event.tags || [],
            status: event.status || "upcoming",
            displayDate: event.date ? new Date(event.date).toLocaleDateString() : "TBD",
            time: event.date ? new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD",
            venue: event.venue || "TBD",
            capacityPercent: event.capacity ? Math.round(((event.registrationCount || 0) / event.capacity) * 100) : 0,
            likes: event.likes || 0,
            comments: event.comments || 0
          }))
        );
      } catch (error) {
        setLoadError(error.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [query]);

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

      {loading ? (
        <section className="empty-page-state">
          <h2>Loading events...</h2>
        </section>
      ) : loadError ? (
        <section className="empty-page-state">
          <h2>Could not load events</h2>
          <p>{loadError}</p>
        </section>
      ) : filteredEvents.length === 0 ? (
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
