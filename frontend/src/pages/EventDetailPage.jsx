import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentThread from "../components/CommentThread";
import ConfirmationDialog from "../components/ConfirmationDialog";
import LightboxMediaViewer from "../components/LightboxMediaViewer";
import { getEventById, highlightItems, threadedComments } from "../data/mockAppData";
import { getStoredProfile } from "../utils/session";

function readRole() {
  try {
    return JSON.parse(localStorage.getItem("uniconnect_user_profile") || "{}").role || "student";
  } catch {
    return "student";
  }
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getEventById(id);
  const role = readRole();
  const [registrationState, setRegistrationState] = useState(event?.registrationState || "default");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const profile = useMemo(() => getStoredProfile?.() || {}, []);

  if (!event) {
    return (
      <section className="page-container">
        <div className="content-card">
          <h1>Event not found</h1>
          <p>The event you were looking for does not exist or has been removed.</p>
          <Link to="/events" className="primary-page-button">
            Back to Events
          </Link>
        </div>
      </section>
    );
  }

  const showRating = event.status === "past";
  const userIsManager = role === "event_manager";
  const registrationCopy = {
    default: { title: "Register Now", helper: "Secure your spot before the deadline." },
    waitlist: { title: "Join Waitlist", helper: "The event is full, but you can still join the queue." },
    registered: { title: "You're Registered", helper: "You can still cancel if your plans change." },
    closed: { title: "Registration Closed", helper: "This event is no longer accepting registrations." }
  }[registrationState];

  function cycleRegistrationState() {
    if (registrationState === "default") setRegistrationState("registered");
    if (registrationState === "waitlist") setRegistrationState("registered");
    if (registrationState === "registered") setRegistrationState("default");
  }

  return (
    <section className="page-container">
      <article className="content-card event-detail-page">
        <img src={event.coverImage} alt={event.title} className="event-detail-banner" />

        <div className="event-detail-header">
          <div>
            <p className="section-kicker">{event.society}</p>
            <h1>{event.title}</h1>
            <div className="tag-row">
              {event.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="event-detail-actions">
            <button type="button" className="home-chip-button">
              Follow Society
            </button>
            <button type="button" className="home-chip-button">
              Share
            </button>
          </div>
        </div>

        <div className="event-detail-grid">
          <div className="event-detail-main">
            <section className="content-card event-detail-section">
              <h2>Event Overview</h2>
              <div className="event-detail-info-grid">
                <div>
                  <strong>Date and Time</strong>
                  <p>
                    {event.displayDate} · {event.time}
                  </p>
                </div>
                <div>
                  <strong>Venue</strong>
                  <p>{event.venue}</p>
                </div>
                <div>
                  <strong>Event Type</strong>
                  <p>{event.eventType}</p>
                </div>
                <div>
                  <strong>Organizer</strong>
                  <p>{event.organizer}</p>
                </div>
                <div>
                  <strong>Registration Deadline</strong>
                  <p>{event.registrationDeadline}</p>
                </div>
              </div>
              <div className="capacity-track">
                <div className="capacity-fill" style={{ width: `${event.capacityPercent}%` }} />
              </div>
              <p className="muted">
                {event.registeredCount} / {event.capacity} registered
              </p>
            </section>

            <section className="content-card event-detail-section">
              <h2>About this event</h2>
              <p>{event.fullDescription}</p>
            </section>

            <section className="content-card event-detail-section">
              <h2>Segments</h2>
              <div className="event-detail-list">
                {event.segments.map((segment) => (
                  <div key={segment.name} className="event-detail-list__item">
                    <strong>{segment.name}</strong>
                    <p>
                      Capacity: {segment.capacity} · Lead: {segment.lead}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="content-card event-detail-section">
              <div className="row-between">
                <h2>Media Gallery</h2>
                <button type="button" onClick={() => setGalleryOpen(true)}>
                  Open Lightbox
                </button>
              </div>
              <div className="event-gallery-grid">
                {event.gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className="event-gallery-grid__item"
                    onClick={() => {
                      setGalleryIndex(index);
                      setGalleryOpen(true);
                    }}
                  >
                    <img src={image} alt={`${event.title} media ${index + 1}`} />
                  </button>
                ))}
              </div>
            </section>

            {event.status === "past" ? (
              <section className="content-card event-detail-section">
                <h2>Post-event highlights</h2>
                <div className="event-detail-list">
                  {(event.postEventHighlights.length ? event.postEventHighlights : highlightItems).map((item) => (
                    <div key={item.id} className="event-detail-list__item">
                      <strong>{item.eventName}</strong>
                      <p>{item.caption}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {showRating ? (
              <section className="content-card event-detail-section">
                <h2>Rate this event</h2>
                <div className="tag-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" className="home-chip-button">
                      {star} Star
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="content-card event-detail-section">
              <h2>Comments</h2>
              <CommentThread comments={threadedComments} />
            </section>
          </div>

          <aside className="event-detail-sidebar">
            <section className="content-card event-detail-section">
              <h2>{registrationCopy.title}</h2>
              <p>{registrationCopy.helper}</p>
              <button
                type="button"
                className="primary-page-button"
                disabled={registrationState === "closed"}
                onClick={cycleRegistrationState}
              >
                {registrationCopy.title}
              </button>
              {registrationState === "registered" ? (
                <button type="button" onClick={() => setRegistrationState("default")}>
                  Cancel Registration
                </button>
              ) : null}
              {registrationState === "waitlist" ? <p>You are currently number 8 on the waitlist.</p> : null}
            </section>

            {userIsManager ? (
              <section className="content-card event-detail-section">
                <h2>Event Manager Controls</h2>
                <div className="event-detail-manager-actions">
                  <Link to={`/events/${event.id}/edit`} className="primary-page-button">
                    Edit Event
                  </Link>
                  <button type="button">Manage Registrations</button>
                  <button type="button">Export CSV</button>
                  <button type="button">Post Highlight</button>
                  <button type="button">Manage Sub-Roles</button>
                  <button type="button" className="danger" onClick={() => setShowDeleteConfirm(true)}>
                    Delete Event
                  </button>
                </div>
              </section>
            ) : null}

            <section className="content-card event-detail-section">
              <h2>Attendee Snapshot</h2>
              <p>Signed in as {profile.fullName || "Campus User"}.</p>
              <p className="muted">Your current role controls what actions you can take on this page.</p>
            </section>
          </aside>
        </div>
      </article>

      <LightboxMediaViewer
        open={galleryOpen}
        items={event.gallery}
        index={galleryIndex}
        onClose={() => setGalleryOpen(false)}
        onPrev={() => setGalleryIndex((current) => (current === 0 ? event.gallery.length - 1 : current - 1))}
        onNext={() => setGalleryIndex((current) => (current + 1) % event.gallery.length)}
      />

      <ConfirmationDialog
        open={showDeleteConfirm}
        title="Delete Event"
        warning="This action removes the event from the public app."
        confirmLabel="Delete Event"
        onConfirm={() => navigate("/events")}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </section>
  );
}
