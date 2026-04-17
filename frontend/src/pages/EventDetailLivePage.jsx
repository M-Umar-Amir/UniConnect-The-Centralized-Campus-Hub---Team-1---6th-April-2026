import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventService } from "../services/eventService";

export default function EventDetailLivePage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState("");

  async function loadEvent() {
    try {
      setLoading(true);
      setError("");
      const payload = await eventService.getById(id);
      setEvent(payload.event || null);
    } catch (e) {
      setError(e.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, [id]);

  const capacityPercent = useMemo(() => {
    if (!event?.capacity) return 0;
    const used = event.registrationCount || 0;
    return Math.min(100, Math.round((used / event.capacity) * 100));
  }, [event]);

  async function register() {
    try {
      const payload = await eventService.register(id);
      setRegistrationMessage(payload?.registration?.status || "Registered");
      await loadEvent();
    } catch (e) {
      setRegistrationMessage(e.message || "Could not register");
    }
  }

  async function cancelRegistration() {
    try {
      await eventService.cancelRegistration(id);
      setRegistrationMessage("Registration cancelled");
      await loadEvent();
    } catch (e) {
      setRegistrationMessage(e.message || "Could not cancel registration");
    }
  }

  if (loading) {
    return <section className="page-container"><div className="content-card">Loading event...</div></section>;
  }

  if (error || !event) {
    return (
      <section className="page-container">
        <div className="content-card">
          <h1>Event not found</h1>
          <p>{error || "This event is unavailable."}</p>
          <Link to="/events" className="primary-page-button">Back to Events</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <article className="content-card event-detail-page">
        <div className="event-detail-header">
          <div>
            <p className="section-kicker">Event Detail</p>
            <h1>{event.title}</h1>
            <p>{event.description || "No description provided."}</p>
          </div>
        </div>

        <div className="event-detail-grid">
          <div className="event-detail-main">
            <section className="content-card event-detail-section">
              <h2>Event Info</h2>
              <p><strong>Venue:</strong> {event.venue || "TBD"}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Type:</strong> {event.eventType || "General"}</p>
              <div className="tag-row">
                {(event.tags || []).map((tag) => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
            </section>
          </div>

          <aside className="event-detail-sidebar">
            <section className="content-card event-detail-section">
              <h2>Registration</h2>
              <div className="capacity-track"><div className="capacity-fill" style={{ width: `${capacityPercent}%` }} /></div>
              <p>{event.registrationCount || 0} / {event.capacity || 0} registered</p>
              <div className="tag-row">
                <button className="primary-page-button" onClick={register}>Register Now</button>
                <button onClick={cancelRegistration}>Cancel</button>
              </div>
              {registrationMessage ? <p className="muted">{registrationMessage}</p> : null}
            </section>
          </aside>
        </div>
      </article>
    </section>
  );
}
