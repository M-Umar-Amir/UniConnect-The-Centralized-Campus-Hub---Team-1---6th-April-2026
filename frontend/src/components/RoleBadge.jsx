const roleMap = {
  student: "Student",
  founder: "Founder",
  event_manager: "Event Manager",
  admin: "Admin"
};

export default function RoleBadge({ role }) {
  return <span className={`role-badge ${role}`}>{roleMap[role] || "Member"}</span>;
}
