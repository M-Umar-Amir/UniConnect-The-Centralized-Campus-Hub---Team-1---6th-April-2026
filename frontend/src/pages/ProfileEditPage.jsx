import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCropInterface from "../components/ImageCropInterface";
import TagPickerModal from "../components/TagPickerModal";
import { interestsCatalog } from "../data/mockAppData";
import { getStoredProfile } from "../utils/session";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const stored = useMemo(() => getStoredProfile(), []);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [cropMode, setCropMode] = useState(null);
  const [form, setForm] = useState({
    name: stored.fullName || "Zara Ahmed",
    university: stored.university || "IBA Karachi",
    year: stored.year || "3rd Year",
    bio: stored.bio || "",
    role: stored.role || "student",
    linkedin: stored.linkedin || "",
    github: stored.github || "",
    interests: stored.interests?.length ? stored.interests : ["Hackathons", "Startups", "Design"],
    showEventsAttended: true,
    showStartups: true,
    publicProfile: true,
    avatarPreview: stored.avatarPreview || "",
    coverPreview: stored.coverPreview || ""
  });

  const hasChanges =
    JSON.stringify({
      ...stored,
      fullName: form.name,
      university: form.university,
      year: form.year,
      bio: form.bio,
      linkedin: form.linkedin,
      github: form.github,
      interests: form.interests
    }) !== JSON.stringify(stored);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleInterest(tag) {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(tag)
        ? current.interests.filter((item) => item !== tag)
        : [...current.interests, tag]
    }));
  }

  function saveProfileChanges() {
    localStorage.setItem(
      "uniconnect_user_profile",
      JSON.stringify({
        ...stored,
        fullName: form.name,
        university: form.university,
        year: form.year,
        bio: form.bio,
        linkedin: form.linkedin,
        github: form.github,
        interests: form.interests,
        avatarPreview: form.avatarPreview,
        coverPreview: form.coverPreview
      })
    );
    navigate("/profile/me");
  }

  return (
    <section className="page-container">
      <div className="content-card profile-edit-page">
        <p className="section-kicker">Profile Settings</p>
        <h1>Edit Profile</h1>
        <p>Update the public information, interests, and privacy settings tied to your campus identity.</p>

        <div className="profile-edit-media-grid">
          <div className="content-card">
            <h2>Avatar</h2>
            <div className="profile-avatar-lg">{form.name[0]}</div>
            <div className="row-end">
              <button type="button" onClick={() => setCropMode("circle")}>
                Change Avatar
              </button>
              <button type="button" onClick={() => updateField("avatarPreview", "")}>
                Remove
              </button>
            </div>
          </div>

          <div className="content-card">
            <h2>Cover Photo</h2>
            <div className="profile-cover profile-cover--editable" />
            <div className="row-end">
              <button type="button" onClick={() => setCropMode("banner")}>
                Change Cover
              </button>
              <button type="button" onClick={() => updateField("coverPreview", "")}>
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="event-editor-grid">
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </label>
          <label>
            <span>University</span>
            <input value={form.university} onChange={(event) => updateField("university", event.target.value)} />
          </label>
          <label>
            <span>Year</span>
            <input value={form.year} onChange={(event) => updateField("year", event.target.value)} />
          </label>
          <label>
            <span>Role</span>
            <input value={form.role} readOnly />
          </label>
          <label className="event-editor-grid__full">
            <span>Bio</span>
            <textarea
              rows={4}
              maxLength={160}
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value.slice(0, 160))}
            />
          </label>
          <label>
            <span>LinkedIn</span>
            <input value={form.linkedin} onChange={(event) => updateField("linkedin", event.target.value)} />
          </label>
          <label>
            <span>GitHub</span>
            <input value={form.github} onChange={(event) => updateField("github", event.target.value)} />
          </label>
        </div>

        <div className="content-card">
          <div className="row-between">
            <div>
              <h2>Interest Tags</h2>
              <p>Keep at least 3 interests selected.</p>
            </div>
            <button type="button" onClick={() => setTagModalOpen(true)}>
              Edit Interests
            </button>
          </div>
          <div className="tag-row">
            {form.interests.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h2>Privacy</h2>
          <label className="toggle-row">
            <span>Show events attended</span>
            <input
              type="checkbox"
              checked={form.showEventsAttended}
              onChange={(event) => updateField("showEventsAttended", event.target.checked)}
            />
          </label>
          <label className="toggle-row">
            <span>Show startups</span>
            <input
              type="checkbox"
              checked={form.showStartups}
              onChange={(event) => updateField("showStartups", event.target.checked)}
            />
          </label>
          <label className="toggle-row">
            <span>Public profile</span>
            <input
              type="checkbox"
              checked={form.publicProfile}
              onChange={(event) => updateField("publicProfile", event.target.checked)}
            />
          </label>
        </div>

        <div className="row-end">
          <button type="button" onClick={() => navigate("/profile/me")}>
            Cancel
          </button>
          <button type="button" className="primary-page-button" disabled={!hasChanges} onClick={saveProfileChanges}>
            Save Changes
          </button>
        </div>
      </div>

      <TagPickerModal
        open={tagModalOpen}
        tags={interestsCatalog}
        selected={form.interests}
        onSelect={toggleInterest}
        onDone={() => setTagModalOpen(false)}
        onClose={() => setTagModalOpen(false)}
      />

      <ImageCropInterface
        open={Boolean(cropMode)}
        mode={cropMode === "banner" ? "banner" : "circle"}
        imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
        onConfirm={() => setCropMode(null)}
        onRecrop={() => null}
        onClose={() => setCropMode(null)}
      />
    </section>
  );
}
