import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/content", label: "Content" },
  { to: "/admin/analytics", label: "Analytics" }
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h3>Admin</h3>
      {links.map((item) => (
        <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
      ))}
    </aside>
  );
}
