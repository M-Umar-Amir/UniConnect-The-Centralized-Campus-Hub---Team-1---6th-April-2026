import { useRef, useState } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CURRENT_USER = { id: "u1", name: "Ali Hassan", role: "founder" };

const DOMAIN_OPTIONS = ["EdTech", "FinTech", "HealthTech", "AI/ML", "SaaS", "CleanTech", "AgriTech", "Social Impact"];
const ROLE_OPTIONS = ["Frontend Dev", "Backend Dev", "UI/UX Designer", "Marketing", "Business Dev", "Data Analyst", "Mobile Dev", "DevOps"];
const STATUS_OPTIONS = ["Ideation", "Building", "MVP Ready", "Launched", "Seeking Funding"];

const MOCK_STARTUPS = [
  {
    id: "s1",
    name: "EduBridge",
    tagline: "Connecting students across borders through collaborative learning.",
    logo: null,
    founder: { id: "u1", name: "Ali Hassan" },
    domains: ["EdTech", "Social Impact"],
    rolesNeeded: ["Frontend Dev", "Marketing"],
    status: "Building",
    likes: 42,
    problem: "Students in developing regions lack access to quality mentors and peer networks.",
    solution: "A platform that matches students globally for peer learning sessions and mentorship.",
    businessModel: "Freemium with institutional licensing for universities.",
    targetAudience: "University students and recent graduates in South Asia and Africa.",
    team: [
      { name: "Ali Hassan", role: "Founder & CEO" },
      { name: "Sara Malik", role: "Lead Designer" },
    ],
    openRoles: ["Frontend Dev", "Marketing"],
    updates: [
      { id: "upd1", title: "MVP Launched!", body: "We shipped our first version to 50 beta users.", date: "2025-04-01", likes: 12, comments: [] },
    ],
    requests: [
      { id: "req1", user: "Hamza R.", role: "Frontend Dev", message: "I'd love to help build the frontend!", status: "pending" },
      { id: "req2", user: "Nida K.", role: "Marketing", message: "Experienced in growth marketing for EdTech.", status: "accepted" },
    ],
  },
  {
    id: "s2",
    name: "MediQuick",
    tagline: "Instant telemedicine for underserved communities.",
    logo: null,
    founder: { id: "u2", name: "Zara Syed" },
    domains: ["HealthTech"],
    rolesNeeded: ["Backend Dev", "Mobile Dev", "UI/UX Designer"],
    status: "MVP Ready",
    likes: 87,
    problem: "Rural patients wait weeks for basic consultations.",
    solution: "On-demand video consultations with verified doctors under 10 minutes.",
    businessModel: "Per-consultation fee + subscription for clinics.",
    targetAudience: "Rural populations in Pakistan and Bangladesh.",
    team: [{ name: "Zara Syed", role: "Founder & CEO" }],
    openRoles: ["Backend Dev", "Mobile Dev", "UI/UX Designer"],
    updates: [],
    requests: [],
  },
  {
    id: "s3",
    name: "GreenLedger",
    tagline: "Carbon tracking and offsetting for SMEs, made simple.",
    logo: null,
    founder: { id: "u3", name: "Omar Farooq" },
    domains: ["CleanTech", "FinTech"],
    rolesNeeded: ["Data Analyst", "Business Dev"],
    status: "Seeking Funding",
    likes: 61,
    problem: "SMEs have no affordable way to track or offset their carbon footprint.",
    solution: "Automated carbon accounting dashboard with one-click offsetting marketplace.",
    businessModel: "SaaS subscription + marketplace commission.",
    targetAudience: "Small and medium enterprises in Europe and South Asia.",
    team: [{ name: "Omar Farooq", role: "Founder" }, { name: "Aisha Noor", role: "Data Engineer" }],
    openRoles: ["Data Analyst", "Business Dev"],
    updates: [
      { id: "upd2", title: "Accepted into ClimaTech Accelerator", body: "Thrilled to announce our acceptance into the 2025 cohort!", date: "2025-03-15", likes: 34, comments: [] },
    ],
    requests: [],
  },
];

// ─── Utility Components ───────────────────────────────────────────────────────
const Avatar = ({ name, size = 36 }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#4F46E5","#0891B2","#059669","#D97706","#DC2626","#7C3AED"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: size * 0.38, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Badge = ({ label, color = "indigo" }) => {
  const palettes = {
    indigo: { bg: "#EEF2FF", text: "#4338CA" },
    cyan:   { bg: "#ECFEFF", text: "#0E7490" },
    green:  { bg: "#ECFDF5", text: "#065F46" },
    amber:  { bg: "#FFFBEB", text: "#92400E" },
    rose:   { bg: "#FFF1F2", text: "#9F1239" },
    violet: { bg: "#F5F3FF", text: "#5B21B6" },
    gray:   { bg: "#F3F4F6", text: "#374151" },
  };
  const p = palettes[color] || palettes.indigo;
  return (
    <span style={{ background: p.bg, color: p.text, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = { "Ideation": "gray", "Building": "indigo", "MVP Ready": "cyan", "Launched": "green", "Seeking Funding": "amber" };
  return <Badge label={status} color={map[status] || "gray"} />;
};

const Button = ({ children, onClick, variant = "primary", size = "md", disabled = false, style = {} }) => {
  const base = { borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.15s", display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.55 : 1 };
  const sizes = { sm: { padding: "6px 12px", fontSize: 12 }, md: { padding: "9px 18px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 15 } };
  const variants = {
    primary:   { background: "#4F46E5", color: "#fff" },
    secondary: { background: "#F3F4F6", color: "#374151" },
    ghost:     { background: "transparent", color: "#4F46E5", border: "1.5px solid #4F46E5" },
    danger:    { background: "#FEE2E2", color: "#991B1B" },
    success:   { background: "#D1FAE5", color: "#065F46" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, maxLength, type = "text", style = {} }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
      style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box", ...style }} />
    {maxLength && <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "right", marginTop: 3 }}>{value.length}/{maxLength}</div>}
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4, inputRef = null }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>}
    <textarea ref={inputRef} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", boxSizing: "border-box" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const MultiSelect = ({ label, options, selected, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{label}</label>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <button key={o} onClick={() => onChange(active ? selected.filter(x => x !== o) : [...selected, o])}
            style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: active ? "1.5px solid #4F46E5" : "1.5px solid #E5E7EB", background: active ? "#EEF2FF" : "#F9FAFB", color: active ? "#4338CA" : "#6B7280", transition: "all 0.15s" }}>
            {o}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── C1: Startup Listing ──────────────────────────────────────────────────────
const StartupCard = ({ startup, onView }) => (
  <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12, transition: "box-shadow 0.2s", cursor: "pointer" }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(79,70,229,0.10)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      {startup.logo
        ? <img src={startup.logo} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
        : <div style={{ width: 44, height: 44, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚀</div>}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{startup.name}</div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>by {startup.founder.name}</div>
      </div>
      <StatusBadge status={startup.status} />
    </div>
    <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.5 }}>{startup.tagline}</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {startup.domains.map(d => <Badge key={d} label={d} color="indigo" />)}
    </div>
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Roles Needed</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {startup.rolesNeeded.map(r => <Badge key={r} label={r} color="cyan" />)}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F3F4F6", paddingTop: 12, marginTop: 4 }}>
      <span style={{ fontSize: 13, color: "#6B7280" }}>❤️ {startup.likes}</span>
      <Button onClick={onView} size="sm" variant="ghost">View Pitch →</Button>
    </div>
  </div>
);

const StartupListing = ({ startups, onView, onCreateClick, userRole }) => {
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = startups.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q);
    const matchDomain = filterDomain === "All" || s.domains.includes(filterDomain);
    const matchRole = filterRole === "All" || s.rolesNeeded.includes(filterRole);
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchDomain && matchRole && matchStatus;
  });

  const selStyle = { border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#374151", background: "#fff", outline: "none", cursor: "pointer" };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>Startup Hub</h1>
          <p style={{ color: "#6B7280", margin: "4px 0 0", fontSize: 14 }}>Discover and collaborate with student startups</p>
        </div>
        {userRole === "founder" && (
          <Button onClick={onCreateClick} size="md">+ Post Startup</Button>
        )}
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search startups..."
          style={{ flex: "1 1 220px", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "9px 14px", fontSize: 13, color: "#111827", outline: "none" }} />
        <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)} style={selStyle}>
          <option value="All">All Domains</option>
          {DOMAIN_OPTIONS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={selStyle}>
          <option value="All">All Roles</option>
          {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF", fontSize: 15 }}>No startups match your filters.</div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {filtered.map(s => <StartupCard key={s.id} startup={s} onView={() => onView(s)} />)}
          </div>
      }
    </div>
  );
};

// ─── C2: Create / Edit Startup Form ──────────────────────────────────────────
const StartupForm = ({ startup = null, onSave, onCancel, onDelete }) => {
  const isEdit = !!startup;
  const [form, setForm] = useState({
    name: startup?.name || "",
    tagline: startup?.tagline || "",
    problem: startup?.problem || "",
    solution: startup?.solution || "",
    businessModel: startup?.businessModel || "",
    targetAudience: startup?.targetAudience || "",
    domains: startup?.domains || [],
    rolesNeeded: startup?.rolesNeeded || [],
    status: startup?.status || "Ideation",
  });
  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B7280" }}>←</button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>{isEdit ? "Edit Startup" : "Post Your Startup"}</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>Route: {isEdit ? `/startups/${startup.id}/edit` : "/startups/create"}</p>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: "28px 28px" }}>
        {/* Basic Info */}
        <SectionHeader title="Basic Info" icon="📋" />
        <Input label="Startup Name" value={form.name} onChange={set("name")} placeholder="e.g. EduBridge" />
        <Input label="Tagline" value={form.tagline} onChange={set("tagline")} placeholder="One-liner about your startup" maxLength={100} />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Logo Upload</label>
          <div style={{ border: "1.5px dashed #D1D5DB", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", color: "#9CA3AF", fontSize: 13 }}>
            📁 Click to upload logo (PNG, JPG — max 2MB)
          </div>
        </div>

        {/* Pitch Content */}
        <SectionHeader title="Pitch Content" icon="💡" />
        <Textarea label="Problem Statement" value={form.problem} onChange={set("problem")} placeholder="What problem are you solving?" rows={3} />
        <Textarea label="Solution" value={form.solution} onChange={set("solution")} placeholder="How does your startup solve this?" rows={3} />
        <Textarea label="Business Model" value={form.businessModel} onChange={set("businessModel")} placeholder="How will you make money?" rows={3} />
        <Textarea label="Target Audience" value={form.targetAudience} onChange={set("targetAudience")} placeholder="Who are your users?" rows={3} />

        {/* Tags & Roles */}
        <SectionHeader title="Tags & Configuration" icon="🏷️" />
        <MultiSelect label="Domain Tags" options={DOMAIN_OPTIONS} selected={form.domains} onChange={set("domains")} />
        <MultiSelect label="Roles Needed" options={ROLE_OPTIONS} selected={form.rolesNeeded} onChange={set("rolesNeeded")} />
        <Select label="Status" value={form.status} onChange={set("status")} options={STATUS_OPTIONS} />

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F3F4F6", paddingTop: 20, marginTop: 8, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={() => onSave(form, "draft")} variant="secondary">💾 Save Draft</Button>
            <Button onClick={() => onSave(form, "publish")}>🚀 Publish Pitch</Button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={onCancel} variant="ghost">Cancel</Button>
            {isEdit && <Button onClick={() => onDelete(startup.id)} variant="danger">🗑 Delete</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 24, paddingBottom: 8, borderBottom: "1px solid #F3F4F6" }}>
    <span style={{ fontSize: 16 }}>{icon}</span>
    <span style={{ fontWeight: 700, fontSize: 14, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
  </div>
);

// ─── C3: Startup Detail Page ──────────────────────────────────────────────────
const StartupDetail = ({ startup, currentUser, onBack, onEdit }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(startup.likes);
  const [requestSent, setRequestSent] = useState(false);
  const [requestRole, setRequestRole] = useState(startup.openRoles[0] || "");
  const [requestMsg, setRequestMsg] = useState("");
  const [showRequests, setShowRequests] = useState(false);
  const [requestsTab, setRequestsTab] = useState("pending");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [updates, setUpdates] = useState(startup.updates);
  const [requests, setRequests] = useState(startup.requests);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);

  const isFounder = currentUser.id === startup.founder.id;
  const isMember = startup.team.some(t => t.name === currentUser.name);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const handleRequest = () => {
    if (requestRole && requestMsg.trim()) setRequestSent(true);
  };

  const handlePublishUpdate = () => {
    const normalizedTitle = updateTitle.trim();
    const normalizedBody = updateBody.trim();

    if (!normalizedTitle || !normalizedBody) {
      return;
    }

    if (editingUpdateId) {
      setUpdates((items) => items.map((item) => (
        item.id === editingUpdateId
          ? { ...item, title: normalizedTitle, body: normalizedBody }
          : item
      )));
    } else {
      setUpdates((items) => [{
        id: Date.now(),
        title: normalizedTitle,
        body: normalizedBody,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        comments: []
      }, ...items]);
    }

    setUpdateTitle("");
    setUpdateBody("");
    setEditingUpdateId(null);
    setShowUpdateForm(false);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const fallbackMessage = `Share this startup page: ${shareUrl}`;

    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("Startup link copied to clipboard.");
    } catch (error) {
      window.alert(fallbackMessage);
    }
  };

  const handleEditUpdate = (update) => {
    setEditingUpdateId(update.id);
    setUpdateTitle(update.title);
    setUpdateBody(update.body);
    setShowUpdateForm(true);
  };

  const handleDeleteUpdate = (updateId) => {
    setUpdates((items) => items.filter((item) => item.id !== updateId));

    if (editingUpdateId === updateId) {
      setEditingUpdateId(null);
      setUpdateTitle("");
      setUpdateBody("");
      setShowUpdateForm(false);
    }
  };

  const handleUpdateLike = (updateId) => {
    setUpdates((items) => items.map((item) => (
      item.id === updateId ? { ...item, likes: (item.likes || 0) + 1 } : item
    )));
  };

  const handleUpdateCommentClick = () => {
    commentInputRef.current?.focus();
  };

  const handleRequestAction = (id, action) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments(c => [...c, { id: Date.now(), author: currentUser.name, text: comment.trim(), date: "Today" }]);
      setComment("");
    }
  };

  const pitchSections = [
    { label: "Problem Statement", value: startup.problem, icon: "❓" },
    { label: "Solution", value: startup.solution, icon: "💡" },
    { label: "Business Model", value: startup.businessModel, icon: "💰" },
    { label: "Target Audience", value: startup.targetAudience, icon: "🎯" },
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
      {/* Back */}
      <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 13, color: "#6B7280", cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Back to Startups
      </button>

      {/* Header Card */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 16, padding: "28px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>🚀</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>{startup.name}</h1>
              <StatusBadge status={startup.status} />
            </div>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 8px" }}>by <span style={{ color: "#4F46E5", fontWeight: 600 }}>{startup.founder.name}</span></p>
            <p style={{ color: "#374151", fontSize: 14, margin: "0 0 12px", lineHeight: 1.6 }}>{startup.tagline}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {startup.domains.map(d => <Badge key={d} label={d} color="indigo" />)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <Button onClick={handleLike} variant={liked ? "primary" : "secondary"} size="sm">{liked ? "❤️" : "🤍"} {likeCount}</Button>
            <Button onClick={handleShare} variant="secondary" size="sm">🔗 Share</Button>
            {isFounder && <Button onClick={onEdit} variant="ghost" size="sm">✏️ Edit</Button>}
          </div>
        </div>
      </div>

      {/* Pitch Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16, marginBottom: 20 }}>
        {pitchSections.map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#374151", marginBottom: 10, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>{s.icon}</span>{s.label}
            </div>
            <p style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <DetailCard title="👥 Team">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: startup.openRoles.length ? 14 : 0 }}>
          {startup.team.map(t => (
            <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 10, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "8px 14px" }}>
              <Avatar name={t.name} size={30} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
        {startup.openRoles.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Open Roles</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {startup.openRoles.map(r => <Badge key={r} label={r} color="green" />)}
            </div>
          </div>
        )}
      </DetailCard>

      {/* Collaboration Request (non-members) */}
      {!isFounder && !isMember && (
        <DetailCard title="🤝 Request to Join">
          {requestSent
            ? <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#065F46", background: "#ECFDF5", borderRadius: 10, padding: "12px 16px", fontSize: 14 }}>
                ✅ Request Sent — the founder will review your application.
              </div>
            : <>
                <Select label="Role you're applying for" value={requestRole} onChange={setRequestRole} options={startup.openRoles.length ? startup.openRoles : ROLE_OPTIONS} />
                <Textarea label="Message to Founder" value={requestMsg} onChange={setRequestMsg} placeholder="Tell them why you'd be a great fit..." rows={3} />
                <Button onClick={handleRequest} disabled={!requestRole || !requestMsg.trim()}>Send Request</Button>
              </>
          }
        </DetailCard>
      )}

      {/* Founder: Manage Requests */}
      {isFounder && (
        <DetailCard title="📬 Collaboration Requests">
          <Button onClick={() => setShowRequests(true)} variant="ghost" size="sm">Manage Requests ({requests.filter(r => r.status === "pending").length} pending)</Button>
          {showRequests && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {["pending", "accepted", "declined"].map(tab => (
                  <button key={tab} onClick={() => setRequestsTab(tab)}
                    style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid", borderColor: requestsTab === tab ? "#4F46E5" : "#E5E7EB", background: requestsTab === tab ? "#EEF2FF" : "#F9FAFB", color: requestsTab === tab ? "#4338CA" : "#6B7280", textTransform: "capitalize" }}>
                    {tab}
                  </button>
                ))}
              </div>
              {requests.filter(r => r.status === requestsTab).map(req => (
                <div key={req.id} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{req.user} <span style={{ fontWeight: 400, color: "#6B7280" }}>— {req.role}</span></div>
                    {req.status === "pending" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button onClick={() => handleRequestAction(req.id, "accepted")} size="sm" variant="success">Accept</Button>
                        <Button onClick={() => handleRequestAction(req.id, "declined")} size="sm" variant="danger">Decline</Button>
                      </div>
                    )}
                    {req.status !== "pending" && <Badge label={req.status} color={req.status === "accepted" ? "green" : "rose"} />}
                  </div>
                  <p style={{ fontSize: 13, color: "#4B5563", margin: 0 }}>{req.message}</p>
                </div>
              ))}
              {requests.filter(r => r.status === requestsTab).length === 0 && (
                <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "20px 0" }}>No {requestsTab} requests.</p>
              )}
            </div>
          )}
        </DetailCard>
      )}

      {/* Updates */}
      <DetailCard title="📢 Updates">
        {isFounder && (
          <div style={{ marginBottom: 16 }}>
            <Button onClick={() => setShowUpdateForm(!showUpdateForm)} size="sm" variant="ghost">+ Post Update</Button>
            {showUpdateForm && (
              <div style={{ marginTop: 14, padding: "16px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                <Input label="Update Title" value={updateTitle} onChange={setUpdateTitle} placeholder="What's new?" />
                <Textarea label="Body" value={updateBody} onChange={setUpdateBody} placeholder="Share the details..." rows={3} />
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={handlePublishUpdate} size="sm">{editingUpdateId ? "Save" : "Publish"}</Button>
                  <Button onClick={() => { setShowUpdateForm(false); setEditingUpdateId(null); setUpdateTitle(""); setUpdateBody(""); }} size="sm" variant="secondary">Cancel</Button>
                </div>
              </div>
            )}
          </div>
        )}
        {updates.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 14 }}>No updates yet.</p>}
        {updates.map(u => (
          <div key={u.id} style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>{u.title}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>{u.date}</div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{u.body}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={() => handleUpdateLike(u.id)} style={{ background: "none", border: "none", fontSize: 13, color: "#6B7280", cursor: "pointer" }}>❤️ {u.likes || 0}</button>
              <button onClick={handleUpdateCommentClick} style={{ background: "none", border: "none", fontSize: 13, color: "#6B7280", cursor: "pointer" }}>💬 Comment</button>
              {isFounder && <>
                <button onClick={() => handleEditUpdate(u)} style={{ background: "none", border: "none", fontSize: 13, color: "#6B7280", cursor: "pointer" }}>✏️ Edit</button>
                <button onClick={() => handleDeleteUpdate(u.id)} style={{ background: "none", border: "none", fontSize: 13, color: "#DC2626", cursor: "pointer" }}>🗑 Delete</button>
              </>}
            </div>
          </div>
        ))}
      </DetailCard>

      {/* Comments */}
      <DetailCard title="💬 Comments">
        <div style={{ marginBottom: 14 }}>
          <Textarea inputRef={commentInputRef} label="Add a comment" value={comment} onChange={setComment} placeholder="Share your thoughts..." rows={2} />
          <Button onClick={handleAddComment} size="sm" disabled={!comment.trim()}>Post Comment</Button>
        </div>
        {comments.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 14 }}>No comments yet. Be the first!</p>}
        {comments.map(c => (
          <div key={c.id} style={{ display: "flex", gap: 10, padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
            <Avatar name={c.author} size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{c.author} <span style={{ fontWeight: 400, color: "#9CA3AF", fontSize: 12 }}>{c.date}</span></div>
              <p style={{ fontSize: 14, color: "#374151", margin: "4px 0 0", lineHeight: 1.5 }}>{c.text}</p>
            </div>
          </div>
        ))}
      </DetailCard>
    </div>
  );
};

const DetailCard = ({ title, children }) => (
  <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
    <h2 style={{ fontWeight: 700, fontSize: 15, color: "#111827", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>{title}</h2>
    {children}
  </div>
);

// ─── App Shell / Router ───────────────────────────────────────────────────────
export default function StartupHub() {
  const [view, setView] = useState("list"); // list | create | edit | detail
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [startups, setStartups] = useState(MOCK_STARTUPS);

  const handleView = (startup) => { setSelectedStartup(startup); setView("detail"); };
  const handleCreate = () => setView("create");
  const handleEdit = () => setView("edit");
  const handleBack = () => { setSelectedStartup(null); setView("list"); };

  const handleSave = (formData, mode) => {
    if (view === "create") {
      const newStartup = { ...formData, id: `s${Date.now()}`, founder: CURRENT_USER, likes: 0, team: [{ name: CURRENT_USER.name, role: "Founder" }], openRoles: formData.rolesNeeded, updates: [], requests: [] };
      setStartups(s => [newStartup, ...s]);
    } else {
      setStartups(s => s.map(st => st.id === selectedStartup.id ? { ...st, ...formData } : st));
      setSelectedStartup(s => ({ ...s, ...formData }));
    }
    alert(`Startup ${mode === "draft" ? "saved as draft" : "published"}!`);
    setView("list");
  };

  const handleDelete = (id) => {
    setStartups(s => s.filter(st => st.id !== id));
    setView("list");
  };

  // Top nav bar
  const NavBar = () => (
    <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", display: "flex", alignItems: "center", gap: 12, height: 52 }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: "#4F46E5", letterSpacing: "-0.02em" }}>UniConnect</div>
      <div style={{ width: 1, height: 20, background: "#E5E7EB" }} />
      <span style={{ fontSize: 13, color: "#6B7280" }}>
        {view === "list" ? "Startup Hub" : view === "create" ? "Post Startup" : view === "edit" ? "Edit Startup" : selectedStartup?.name}
      </span>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <Badge label={CURRENT_USER.role === "founder" ? "Founder" : "Student"} color="indigo" />
        <Avatar name={CURRENT_USER.name} size={28} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{CURRENT_USER.name}</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavBar />
      {view === "list" && <StartupListing startups={startups} onView={handleView} onCreateClick={handleCreate} userRole={CURRENT_USER.role} />}
      {view === "create" && <StartupForm onSave={handleSave} onCancel={handleBack} />}
      {view === "edit" && <StartupForm startup={selectedStartup} onSave={handleSave} onCancel={() => setView("detail")} onDelete={handleDelete} />}
      {view === "detail" && selectedStartup && <StartupDetail startup={selectedStartup} currentUser={CURRENT_USER} onBack={handleBack} onEdit={handleEdit} />}
    </div>
  );
}
