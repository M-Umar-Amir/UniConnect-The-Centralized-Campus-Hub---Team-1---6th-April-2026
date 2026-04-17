import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        "#0F1117",
  surface:   "#16181F",
  surface2:  "#1E2029",
  border:    "#2A2D3A",
  accent:    "#6366F1",
  accentLt:  "#818CF8",
  accentBg:  "#1E1F3B",
  text:      "#F1F2F6",
  muted:     "#8B8FA8",
  success:   "#10B981",
  successBg: "#0D2B22",
  warning:   "#F59E0B",
  warningBg: "#2B200D",
  danger:    "#EF4444",
  dangerBg:  "#2B0D0D",
  info:      "#38BDF8",
  infoBg:    "#0D1F2B",
};

// ─── Shared Primitives ────────────────────────────────────────────────────────
const Badge = ({ label, color = "accent" }) => {
  const map = {
    accent:  { bg: C.accentBg,  text: C.accentLt },
    green:   { bg: C.successBg, text: C.success },
    amber:   { bg: C.warningBg, text: C.warning },
    red:     { bg: C.dangerBg,  text: C.danger },
    blue:    { bg: C.infoBg,    text: C.info },
    gray:    { bg: "#1E2029",   text: C.muted },
  };
  const p = map[color] || map.gray;
  return (
    <span style={{ background: p.bg, color: p.text, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
};

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled = false, style: s = {} }) => {
  const sizes = { sm: { padding: "5px 12px", fontSize: 12 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "11px 22px", fontSize: 14 } };
  const vars = {
    primary:   { background: C.accent,    color: "#fff",    border: "none" },
    secondary: { background: C.surface2,  color: C.text,    border: `1px solid ${C.border}` },
    ghost:     { background: "transparent", color: C.accentLt, border: `1px solid ${C.accent}` },
    danger:    { background: C.dangerBg,  color: C.danger,  border: `1px solid ${C.danger}` },
    success:   { background: C.successBg, color: C.success, border: `1px solid ${C.success}` },
    warning:   { background: C.warningBg, color: C.warning, border: `1px solid ${C.warning}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ ...sizes[size], ...vars[variant], borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s", fontFamily: "inherit", ...s }}>
      {children}
    </button>
  );
};

const StatCard = ({ label, value, delta, color = "accent" }) => {
  const textColor = { accent: C.accentLt, green: C.success, amber: C.warning, red: C.danger, blue: C.info }[color];
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: textColor, lineHeight: 1 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{delta}</div>}
    </div>
  );
};

const TableRow = ({ children, highlight }) => (
  <tr style={{ borderBottom: `1px solid ${C.border}`, background: highlight === "yellow" ? "#1F1A0A" : highlight === "red" ? "#1A0A0A" : "transparent" }}>
    {children}
  </tr>
);

const Td = ({ children, style: s = {} }) => (
  <td style={{ padding: "12px 14px", fontSize: 13, color: C.text, verticalAlign: "middle", ...s }}>{children}</td>
);

const Th = ({ children }) => (
  <th style={{ padding: "10px 14px", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: `1px solid ${C.border}`, background: C.surface2 }}>
    {children}
  </th>
);

const Input = ({ value, onChange, placeholder, style: s = {} }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", ...s }} />
);

const Select = ({ value, onChange, options, style: s = {} }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: C.text, outline: "none", cursor: "pointer", fontFamily: "inherit", ...s }}>
    {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);

const Toggle = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
    <div onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, background: checked ? C.accent : C.border, position: "relative", transition: "background 0.2s", flexShrink: 0, cursor: "pointer" }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left 0.2s" }} />
    </div>
    <span style={{ fontSize: 14, color: C.text }}>{label}</span>
  </label>
);

const Avatar = ({ name, size = 32 }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const cols = ["#6366F1","#0891B2","#059669","#D97706","#DC2626","#7C3AED"];
  const col = cols[name.charCodeAt(0) % cols.length];
  return <div style={{ width: size, height: size, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>{initials}</div>;
};

const SectionHead = ({ title }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", padding: "16px 20px 6px" }}>{title}</div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, width: "100%", maxWidth: 640, maxHeight: "85vh", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: "20px 22px" }}>{children}</div>
    </div>
  </div>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "u1", name: "Ali Hassan",   email: "ali@uni.edu",   uni: "FAST NUCES",  role: "founder",  status: "active",    joined: "2024-09-01", verified: true },
  { id: "u2", name: "Zara Syed",    email: "zara@uni.edu",  uni: "IBA Karachi", role: "student",  status: "active",    joined: "2024-10-14", verified: true },
  { id: "u3", name: "Hamza Raza",   email: "hamza@uni.edu", uni: "LUMS",        role: "student",  status: "suspended", joined: "2024-08-22", verified: false },
  { id: "u4", name: "Nida Khan",    email: "nida@uni.edu",  uni: "NED",         role: "admin",    status: "active",    joined: "2024-07-01", verified: true },
  { id: "u5", name: "Omar Farooq",  email: "omar@uni.edu",  uni: "COMSATS",     role: "founder",  status: "banned",    joined: "2024-11-03", verified: false },
  { id: "u6", name: "Sara Malik",   email: "sara@uni.edu",  uni: "FAST NUCES",  role: "student",  status: "active",    joined: "2025-01-10", verified: true },
];

const MOCK_CONTENT = [
  { id: "c1", type: "post",    preview: "Check out this amazing startup opportunity...", author: "Ali Hassan",  reportedBy: "Zara Syed",   reason: "Spam",            date: "2025-04-10", status: "pending" },
  { id: "c2", type: "comment", preview: "This is completely wrong and misleading!",       author: "Hamza Raza",  reportedBy: "Sara Malik",   reason: "Misinformation",  date: "2025-04-11", status: "pending" },
  { id: "c3", type: "startup", preview: "MediQuick — instant telemedicine...",            author: "Zara Syed",   reportedBy: "Omar Farooq",  reason: "False Claims",    date: "2025-04-09", status: "reviewed" },
  { id: "c4", type: "event",   preview: "Free iPhone giveaway at our next meetup!",       author: "Omar Farooq", reportedBy: "Nida Khan",    reason: "Scam",            date: "2025-04-08", status: "removed" },
  { id: "c5", type: "post",    preview: "Hateful comment targeting a specific group...",  author: "Hamza Raza",  reportedBy: "Ali Hassan",   reason: "Hate Speech",     date: "2025-04-12", status: "pending" },
];

const MOCK_TAGS = [
  { id: "t1", name: "EdTech",        events: 12, users: 45, created: "2024-08-01" },
  { id: "t2", name: "FinTech",       events: 8,  users: 30, created: "2024-08-01" },
  { id: "t3", name: "AI/ML",         events: 19, users: 78, created: "2024-08-01" },
  { id: "t4", name: "CleanTech",     events: 5,  users: 20, created: "2024-09-15" },
  { id: "t5", name: "Blockchain",    events: 0,  users: 0,  created: "2024-10-01", deprecated: true },
  { id: "t6", name: "HealthTech",    events: 7,  users: 29, created: "2024-08-01" },
];

const LINE_DATA = [14,22,18,31,27,44,38,52,47,61,55,70];
const BAR_DATA  = [5,9,7,14,11,18,15,20,16,24,19,28];
const MONTHS    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Mini Chart Components ─────────────────────────────────────────────────────
const MiniLineChart = ({ data, color, label }) => {
  const max = Math.max(...data); const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 340 + 30;
    const y = 80 - ((v - min) / (max - min || 1)) * 60 + 10;
    return `${x},${y}`;
  }).join(" ");
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>{label}</div>
      <svg viewBox="0 0 400 100" style={{ width: "100%", height: 100 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * 340 + 30;
          const y = 80 - ((v - min) / (max - min || 1)) * 60 + 10;
          return <circle key={i} cx={x} cy={y} r="3.5" fill={color} />;
        })}
        {MONTHS.filter((_, i) => i % 3 === 0).map((m, j) => (
          <text key={m} x={30 + j * 3 * (340/11)} y="98" fontSize="10" fill={C.muted} textAnchor="middle">{m}</text>
        ))}
      </svg>
    </div>
  );
};

const MiniBarChart = ({ data, color, label }) => {
  const max = Math.max(...data);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>{label}</div>
      <svg viewBox="0 0 400 100" style={{ width: "100%", height: 100 }}>
        {data.map((v, i) => {
          const bw = 24; const gap = 9;
          const x = i * (bw + gap) + 10;
          const h = (v / max) * 70;
          const y = 85 - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw} height={h} rx="4" fill={color} opacity="0.85" />
              {i % 3 === 0 && <text x={x + bw/2} y="99" fontSize="10" fill={C.muted} textAnchor="middle">{MONTHS[i]}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── D1: Admin Dashboard ──────────────────────────────────────────────────────
const Dashboard = () => {
  const flaggedPreview = MOCK_CONTENT.filter(c => c.status === "pending").slice(0, 5);
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Platform overview and key metrics" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Users"       value="1,284" delta="+12 today"  color="accent" />
        <StatCard label="Total Events"      value="347"   delta="+5 this week" color="blue" />
        <StatCard label="Registrations"     value="4,921" delta="All time"   color="green" />
        <StatCard label="Active Societies"  value="38"    delta="Currently"   color="amber" />
        <StatCard label="Flagged Content"   value="5"     delta="Needs review" color="red" />
        <StatCard label="Signups Today"     value="12"    delta="↑ vs yesterday" color="green" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <MiniLineChart data={LINE_DATA} color={C.accentLt} label="New Users Over Time" />
        <MiniBarChart  data={BAR_DATA}  color={C.info}     label="Events Created" />
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>⚠️ Flagged Content — Recent</span>
          <Badge label={`${flaggedPreview.length} pending`} color="red" />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><Th>Type</Th><Th>Preview</Th><Th>Author</Th><Th>Reason</Th><Th>Date</Th></tr></thead>
          <tbody>
            {flaggedPreview.map(item => (
              <TableRow key={item.id}>
                <Td><Badge label={item.type} color="gray" /></Td>
                <Td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.muted }}>{item.preview}</Td>
                <Td>{item.author}</Td>
                <Td><Badge label={item.reason} color="amber" /></Td>
                <Td style={{ color: C.muted }}>{item.date}</Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── D2: User Management ──────────────────────────────────────────────────────
const UserManagement = () => {
  const [search, setSearch]       = useState("");
  const [filterRole, setRole]     = useState("All");
  const [filterStatus, setStatus] = useState("All");
  const [users, setUsers]         = useState(MOCK_USERS);
  const [modal, setModal]         = useState(null); // { type, user }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (filterRole   === "All" || u.role   === filterRole)
      && (filterStatus === "All" || u.status === filterStatus);
  });

  const updateUser = (id, changes) => setUsers(us => us.map(u => u.id === id ? { ...u, ...changes } : u));

  const roleColor = { founder: "accent", student: "blue", admin: "amber" };
  const statusColor = { active: "green", suspended: "amber", banned: "red" };

  return (
    <div>
      <PageHeader title="User Management" subtitle="Search, filter, and manage platform users" />
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <Input value={search} onChange={setSearch} placeholder="🔍  Search by name or email..." style={{ flex: "1 1 220px" }} />
        <Select value={filterRole} onChange={setRole} options={["All","founder","student","admin"].map(v => ({ value: v, label: v === "All" ? "All Roles" : v }))} />
        <Select value={filterStatus} onChange={setStatus} options={["All","active","suspended","banned"].map(v => ({ value: v, label: v === "All" ? "All Statuses" : v }))} />
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><Th>User</Th><Th>University</Th><Th>Role</Th><Th>Status</Th><Th>Joined</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <TableRow key={u.id} highlight={u.status === "suspended" ? "yellow" : u.status === "banned" ? "red" : null}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.name} size={32} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name} {u.verified && <span style={{ color: C.info, fontSize: 11 }}>✓</span>}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td style={{ color: C.muted }}>{u.uni}</Td>
                <Td><Badge label={u.role} color={roleColor[u.role]} /></Td>
                <Td><Badge label={u.status} color={statusColor[u.status]} /></Td>
                <Td style={{ color: C.muted }}>{u.joined}</Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="secondary" onClick={() => setModal({ type: "view", user: u })}>View</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setModal({ type: "role", user: u })}>Role</Btn>
                    {!u.verified && <Btn size="sm" variant="success" onClick={() => updateUser(u.id, { verified: true })}>Verify</Btn>}
                    {u.status === "active" && <Btn size="sm" variant="warning" onClick={() => setModal({ type: "suspend", user: u })}>Suspend</Btn>}
                    {u.status !== "banned" && <Btn size="sm" variant="danger" onClick={() => updateUser(u.id, { status: "banned" })}>Ban</Btn>}
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: C.muted }}>No users match your filters.</div>}
      </div>

      {/* Modals */}
      {modal?.type === "view" && (
        <Modal title="User Profile" onClose={() => setModal(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Avatar name={modal.user.name} size={52} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{modal.user.name}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{modal.user.email}</div>
            </div>
          </div>
          {[["University", modal.user.uni], ["Role", modal.user.role], ["Status", modal.user.status], ["Joined", modal.user.joined], ["Verified", modal.user.verified ? "Yes" : "No"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
              <span style={{ color: C.muted }}>{k}</span><span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </Modal>
      )}
      {modal?.type === "role" && (
        <Modal title="Change Role" onClose={() => setModal(null)}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Change role for <strong style={{ color: C.text }}>{modal.user.name}</strong></p>
          {["student","founder","admin"].map(r => (
            <Btn key={r} variant={modal.user.role === r ? "primary" : "secondary"} style={{ marginRight: 8, marginBottom: 8, textTransform: "capitalize" }}
              onClick={() => { updateUser(modal.user.id, { role: r }); setModal(null); }}>{r}</Btn>
          ))}
        </Modal>
      )}
      {modal?.type === "suspend" && (
        <Modal title="Suspend User" onClose={() => setModal(null)}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Suspending <strong style={{ color: C.text }}>{modal.user.name}</strong></p>
          <Select value="7" onChange={() => {}} options={[{value:"1",label:"1 day"},{value:"7",label:"7 days"},{value:"30",label:"30 days"},{value:"90",label:"90 days"}]} style={{ width: "100%", marginBottom: 12 }} />
          <textarea placeholder="Reason for suspension..." rows={3}
            style={{ width: "100%", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.text, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="warning" onClick={() => { updateUser(modal.user.id, { status: "suspended" }); setModal(null); }}>Confirm Suspend</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── D3: Content Moderation ───────────────────────────────────────────────────
const ContentModeration = () => {
  const [filterType, setType]     = useState("All");
  const [filterStatus, setStatus] = useState("All");
  const [content, setContent]     = useState(MOCK_CONTENT);
  const [viewModal, setViewModal] = useState(null);
  const [broadcast, setBroadcast] = useState(false);
  const [bTitle, setBTitle]       = useState("");
  const [bBody, setBBody]         = useState("");
  const [bTarget, setBTarget]     = useState("all");

  const filtered = content.filter(c =>
    (filterType === "All" || c.type === filterType) &&
    (filterStatus === "All" || c.status === filterStatus)
  );

  const updateContent = (id, changes) => setContent(cs => cs.map(c => c.id === id ? { ...c, ...changes } : c));
  const statusColor = { pending: "amber", reviewed: "blue", dismissed: "gray", removed: "red" };

  return (
    <div>
      <PageHeader title="Content Moderation" subtitle="Review flagged content and take action" />
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <Select value={filterType} onChange={setType} options={["All","post","comment","startup","event"].map(v => ({ value: v, label: v === "All" ? "All Types" : v }))} />
        <Select value={filterStatus} onChange={setStatus} options={["All","pending","reviewed","dismissed","removed"].map(v => ({ value: v, label: v === "All" ? "All Statuses" : v }))} />
        <div style={{ marginLeft: "auto" }}>
          <Btn variant="ghost" onClick={() => setBroadcast(true)}>📢 Broadcast Announcement</Btn>
        </div>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><Th>Type</Th><Th>Preview</Th><Th>Author</Th><Th>Reported By</Th><Th>Reason</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <TableRow key={item.id}>
                <Td><Badge label={item.type} color="gray" /></Td>
                <Td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.muted }}>{item.preview}</Td>
                <Td>{item.author}</Td>
                <Td style={{ color: C.muted }}>{item.reportedBy}</Td>
                <Td><Badge label={item.reason} color="amber" /></Td>
                <Td><Badge label={item.status} color={statusColor[item.status]} /></Td>
                <Td>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <Btn size="sm" variant="secondary" onClick={() => setViewModal(item)}>View</Btn>
                    <Btn size="sm" variant="danger"    onClick={() => updateContent(item.id, { status: "removed" })}>Remove</Btn>
                    <Btn size="sm" variant="ghost"     onClick={() => updateContent(item.id, { status: "dismissed" })}>Dismiss</Btn>
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: C.muted }}>No content matches your filters.</div>}
      </div>

      {viewModal && (
        <Modal title="Full Content Review" onClose={() => setViewModal(null)}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <Badge label={viewModal.type} color="gray" />
              <Badge label={viewModal.status} color={statusColor[viewModal.status]} />
            </div>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px", fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>
              {viewModal.preview} (Full content would load here from API)
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>
              <strong style={{ color: C.text }}>Author:</strong> {viewModal.author} &nbsp;|&nbsp;
              <strong style={{ color: C.text }}>Reported by:</strong> {viewModal.reportedBy} &nbsp;|&nbsp;
              <strong style={{ color: C.text }}>Reason:</strong> {viewModal.reason}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn variant="danger"   onClick={() => { updateContent(viewModal.id, { status: "removed" });   setViewModal(null); }}>Remove Content</Btn>
            <Btn variant="ghost"    onClick={() => { updateContent(viewModal.id, { status: "dismissed" }); setViewModal(null); }}>Dismiss Report</Btn>
            <Btn variant="warning"  onClick={() => setViewModal(null)}>Warn User</Btn>
            <Btn variant="secondary" onClick={() => setViewModal(null)}>Ban User</Btn>
          </div>
        </Modal>
      )}

      {broadcast && (
        <Modal title="📢 Broadcast Announcement" onClose={() => setBroadcast(false)}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>TITLE</label>
            <Input value={bTitle} onChange={setBTitle} placeholder="Announcement title" style={{ width: "100%", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>BODY</label>
            <textarea value={bBody} onChange={e => setBBody(e.target.value)} placeholder="Write your announcement..." rows={4}
              style={{ width: "100%", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.text, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>TARGET AUDIENCE</label>
            <Select value={bTarget} onChange={setBTarget} options={[{value:"all",label:"All Users"},{value:"students",label:"Students Only"},{value:"founders",label:"Founders Only"},{value:"admins",label:"Admins Only"}]} style={{ width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={() => { alert("Announcement broadcast!"); setBroadcast(false); setBTitle(""); setBBody(""); }}>Send Broadcast</Btn>
            <Btn variant="secondary" onClick={() => setBroadcast(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── D5: Tag Management ───────────────────────────────────────────────────────
const TagManagement = () => {
  const [tags, setTags]       = useState(MOCK_TAGS);
  const [editId, setEditId]   = useState(null);
  const [editName, setEditName] = useState("");
  const [newTag, setNewTag]   = useState("");
  const [newTagErr, setNewTagErr] = useState("");

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (tags.some(t => t.name.toLowerCase() === newTag.toLowerCase())) { setNewTagErr("Tag already exists."); return; }
    setTags(ts => [...ts, { id: `t${Date.now()}`, name: newTag.trim(), events: 0, users: 0, created: new Date().toISOString().split("T")[0] }]);
    setNewTag(""); setNewTagErr("");
  };

  const handleEdit = (tag) => { setEditId(tag.id); setEditName(tag.name); };
  const handleSaveEdit = (id) => {
    setTags(ts => ts.map(t => t.id === id ? { ...t, name: editName } : t));
    setEditId(null);
  };

  return (
    <div>
      <PageHeader title="Tag Management" subtitle="Manage domain and interest tags across the platform" />
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><Th>Tag Name</Th><Th>Events</Th><Th>Users</Th><Th>Created</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {tags.map(tag => (
              <TableRow key={tag.id}>
                <Td>
                  {editId === tag.id
                    ? <Input value={editName} onChange={setEditName} style={{ width: 160 }} />
                    : <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 600 }}>{tag.name}</span>
                        {tag.deprecated && <Badge label="deprecated" color="gray" />}
                      </div>
                  }
                </Td>
                <Td style={{ color: C.muted }}>{tag.events}</Td>
                <Td style={{ color: C.muted }}>{tag.users}</Td>
                <Td style={{ color: C.muted }}>{tag.created}</Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {editId === tag.id
                      ? <>
                          <Btn size="sm" variant="success" onClick={() => handleSaveEdit(tag.id)}>Save</Btn>
                          <Btn size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Btn>
                        </>
                      : <>
                          <Btn size="sm" variant="ghost" onClick={() => handleEdit(tag)}>Edit</Btn>
                          {!tag.deprecated && <Btn size="sm" variant="warning" onClick={() => setTags(ts => ts.map(t => t.id === tag.id ? { ...t, deprecated: true } : t))}>Deprecate</Btn>}
                          <Btn size="sm" variant="danger" disabled={tag.events > 0 || tag.users > 0} onClick={() => setTags(ts => ts.filter(t => t.id !== tag.id))}>Delete</Btn>
                        </>
                    }
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>➕ Add New Tag</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <Input value={newTag} onChange={v => { setNewTag(v); setNewTagErr(""); }} placeholder="e.g. DeepTech" style={{ width: "100%", boxSizing: "border-box" }} />
            {newTagErr && <div style={{ fontSize: 12, color: C.danger, marginTop: 4 }}>{newTagErr}</div>}
          </div>
          <Btn onClick={handleAddTag} variant="primary">Add Tag</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── D6: System Settings ──────────────────────────────────────────────────────
const SystemSettings = () => {
  const [settings, setSettings] = useState({
    platformName: "UniConnect",
    maintenance: false,
    allowRegistrations: true,
    allowEventCreation: true,
    startupHub: true,
    comments: true,
    likes: true,
    notifications: true,
    slowConnection: false,
  });
  const set = (key) => (val) => setSettings(s => ({ ...s, [key]: val }));
  const reset = () => setSettings({ platformName: "UniConnect", maintenance: false, allowRegistrations: true, allowEventCreation: true, startupHub: true, comments: true, likes: true, notifications: true, slowConnection: false });

  const Section = ({ title, children }) => (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px", marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 18 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div>
      <PageHeader title="System Settings" subtitle="Configure platform-wide behaviour and features" />
      <Section title="General">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>PLATFORM NAME</label>
          <Input value={settings.platformName} onChange={set("platformName")} style={{ width: 280 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Toggle checked={settings.maintenance}        onChange={set("maintenance")}        label="Maintenance Mode — platform will show a maintenance page to all users" />
          <Toggle checked={settings.allowRegistrations} onChange={set("allowRegistrations")} label="Allow New Registrations" />
          <Toggle checked={settings.allowEventCreation} onChange={set("allowEventCreation")} label="Allow Event Creation" />
        </div>
      </Section>
      <Section title="Feature Toggles">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Toggle checked={settings.startupHub}    onChange={set("startupHub")}    label="Startup Hub" />
          <Toggle checked={settings.comments}      onChange={set("comments")}      label="Comments" />
          <Toggle checked={settings.likes}         onChange={set("likes")}         label="Likes" />
          <Toggle checked={settings.notifications} onChange={set("notifications")} label="Notifications" />
          <Toggle checked={settings.slowConnection} onChange={set("slowConnection")} label="Slow Connection Mode — reduces asset sizes and disables animations" />
        </div>
      </Section>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="primary" onClick={() => alert("Settings saved!")}>💾 Save Settings</Btn>
        <Btn variant="danger"  onClick={reset}>↩ Reset to Defaults</Btn>
      </div>
    </div>
  );
};

// ─── Shared Page Header ───────────────────────────────────────────────────────
const PageHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>{subtitle}</p>}
  </div>
);

// ─── Admin Sidebar ────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",   label: "Dashboard",           icon: "⬡" },
  { id: "users",       label: "User Management",      icon: "👥" },
  { id: "moderation",  label: "Content Moderation",   icon: "🛡" },
  { id: "tags",        label: "Tag Management",        icon: "🏷" },
  { id: "settings",    label: "System Settings",       icon: "⚙" },
];

const Sidebar = ({ active, onNav }) => (
  <div style={{ width: 220, minHeight: "100vh", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
    {/* Logo */}
    <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ fontWeight: 900, fontSize: 16, color: C.accent, letterSpacing: "-0.03em" }}>UniConnect</div>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: "0.08em", marginTop: 2 }}>ADMIN PANEL</div>
    </div>
    <SectionHead title="Navigation" />
    <nav style={{ flex: 1 }}>
      {NAV.map(item => {
        const isActive = active === item.id;
        return (
          <div key={item.id} onClick={() => onNav(item.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? C.accentLt : C.muted, background: isActive ? C.accentBg : "transparent", borderRight: isActive ? `3px solid ${C.accent}` : "3px solid transparent", transition: "all 0.15s" }}>
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </div>
        );
      })}
    </nav>
    {/* Back to Main Site */}
    <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted, cursor: "pointer" }}
        onClick={() => alert("Navigate to main site")}>
        ← Back to Main Site
      </div>
    </div>
  </div>
);

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [page, setPage] = useState("dashboard");
  const pages = { dashboard: Dashboard, users: UserManagement, moderation: ContentModeration, tags: TagManagement, settings: SystemSettings };
  const Page = pages[page] || Dashboard;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.text }}>
      <Sidebar active={page} onNav={setPage} />
      <div style={{ flex: 1, padding: "32px 36px", overflow: "auto" }}>
        <Page />
      </div>
    </div>
  );
}
