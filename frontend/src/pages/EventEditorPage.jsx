import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmationDialog from "../components/ConfirmationDialog";
import TagPickerModal from "../components/TagPickerModal";
import { events, interestsCatalog, getEventById } from "../data/mockAppData";

const eventTypeOptions = ["Networking", "Hackathon", "Showcase", "Summit", "Workshop"];

function readRole() {
  try {
    return JSON.parse(localStorage.getItem("uniconnect_user_profile") || "{}").role || "student";
  } catch {
    return "student";
  }
}

export default function EventEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = readRole();
  const existingEvent = useMemo(() => (id ? getEventById(id) : null), [id]);
  const isEdit = Boolean(existingEvent);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    title: existingEvent?.title || "",
    shortDescription: existingEvent?.description || "",
    fullDescription: existingEvent?.fullDescription || "",
    eventType: existingEvent?.eventType || "Networking",
    start: existingEvent?.date || "",
    end: existingEvent?.date || "",
    venue: existingEvent?.venue || "",
    mode: "in-person",
    coverImage: existingEvent?.coverImage || "",
    tags: existingEvent?.tags || ["Networking"],
    capacity: existingEvent?.capacity || 100,
    deadline: existingEvent?.registrationDeadline || "",
    waitlist: true,
    registrationRequired: true,
    segments: existingEvent?.segments || []
  });

  if (role !== "event_manager") {
    return (
      <section className="page-container">
        <div className="content-card">
          <h1>Event Managers Only</h1>
          <p>This route is reserved for event managers.</p>
          <Link to="/events" className="primary-page-button">
            Back to Events
          </Link>
        </div>
      </section>
    );
  }

  function toggleTag(tag) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag]
    }));
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveAndExit() {
    navigate(isEdit ? `/events/${id}` : "/events");
  }

  return (
    <section className="page-container">
      <div className="content-card event-editor-page">
        <p className="section-kicker">{isEdit ? "Edit event" : "Create event"}</p>
        <h1>{isEdit ? "Update Event" : "Create a New Event"}</h1>
        <p>Use this form to publish a polished event page with enough detail for students to trust it.</p>

        <div className="event-editor-grid">
          <label>
            <span>Title</span>
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </label>
          <label>
            <span>Event Type</span>
            <select value={form.eventType} onChange={(event) => updateField("eventType", event.target.value)}>
              {eventTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="event-editor-grid__full">
            <span>Short Description</span>
            <textarea
              rows={3}
              maxLength={280}
              value={form.shortDescription}
              onChange={(event) => updateField("shortDescription", event.target.value)}
            />
          </label>
          <label className="event-editor-grid__full">
            <span>Full Description</span>
            <textarea
              rows={6}
              value={form.fullDescription}
              onChange={(event) => updateField("fullDescription", event.target.value)}
            />
          </label>
          <label>
            <span>Start Date</span>
            <input type="date" value={form.start} onChange={(event) => updateField("start", event.target.value)} />
          </label>
          <label>
            <span>End Date</span>
            <input type="date" value={form.end} onChange={(event) => updateField("end", event.target.value)} />
          </label>
          <label>
            <span>Venue</span>
            <input value={form.venue} onChange={(event) => updateField("venue", event.target.value)} />
          </label>
          <label>
            <span>Mode</span>
            <select value={form.mode} onChange={(event) => updateField("mode", event.target.value)}>
              <option value="in-person">In-person</option>
              <option value="online">Online</option>
            </select>
          </label>
          <label className="event-editor-grid__full">
            <span>Cover Image URL</span>
            <input value={form.coverImage} onChange={(event) => updateField("coverImage", event.target.value)} />
          </label>
          <label>
            <span>Capacity</span>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(event) => updateField("capacity", Number(event.target.value))}
            />
          </label>
          <label>
            <span>Registration Deadline</span>
            <input type="date" value={form.deadline} onChange={(event) => updateField("deadline", event.target.value)} />
          </label>
          <label className="toggle-row">
            <span>Enable Waitlist</span>
            <input
              type="checkbox"
              checked={form.waitlist}
              onChange={(event) => updateField("waitlist", event.target.checked)}
            />
          </label>
          <label className="toggle-row">
            <span>Registration Required</span>
            <input
              type="checkbox"
              checked={form.registrationRequired}
              onChange={(event) => updateField("registrationRequired", event.target.checked)}
            />
          </label>
        </div>

        <div className="content-card">
          <div className="row-between">
            <div>
              <h2>Tags</h2>
              <p>Select from suggested tags and fine-tune the event positioning.</p>
            </div>
            <button type="button" onClick={() => setTagModalOpen(true)}>
              Pick Tags
            </button>
          </div>
          <div className="tag-row">
            {form.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h2>Sub-Roles / Segments</h2>
          <div className="event-detail-list">
            {form.segments.map((segment) => (
              <div key={segment.name} className="event-detail-list__item">
                <strong>{segment.name}</strong>
                <p>
                  Capacity: {segment.capacity} · Lead: {segment.lead}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="row-end">
          <button type="button" onClick={() => navigate("/events")}>
            Cancel
          </button>
          <button type="button" onClick={saveAndExit}>
            Save Draft
          </button>
          <button type="button" className="primary-page-button" onClick={saveAndExit}>
            Publish
          </button>
          {isEdit ? (
            <>
              <button type="button">Unpublish</button>
              <button type="button" className="danger" onClick={() => setShowDeleteConfirm(true)}>
                Delete
              </button>
            </>
          ) : null}
        </div>
      </div>

      <TagPickerModal
        open={tagModalOpen}
        tags={[...new Set([...interestsCatalog, ...events.flatMap((event) => event.tags)])]}
        selected={form.tags}
        onSelect={toggleTag}
        onDone={() => setTagModalOpen(false)}
        onClose={() => setTagModalOpen(false)}
      />

      <ConfirmationDialog
        open={showDeleteConfirm}
        title="Delete Event"
        warning="This event will be removed from the app."
        confirmLabel="Delete"
        onConfirm={() => navigate("/events")}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </section>
  );
}
