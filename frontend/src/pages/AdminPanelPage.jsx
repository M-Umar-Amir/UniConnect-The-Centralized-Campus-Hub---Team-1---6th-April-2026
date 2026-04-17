import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services/adminService";
import { tagService } from "../services/tagService";

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    const payload = await adminService.listUsers();
    setUsers(payload.data || []);
  }

  async function loadTags() {
    const payload = await tagService.list();
    setTags(payload.data || []);
  }

  async function bootstrap() {
    try {
      setLoading(true);
      setError("");
      await Promise.all([loadUsers(), loadTags()]);
    } catch (e) {
      setError(e.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  const totals = useMemo(
    () => ({
      totalUsers: users.length,
      blockedUsers: users.filter((u) => u.isBlocked).length,
      totalTags: tags.length
    }),
    [users, tags]
  );

  async function block(userId) {
    try {
      await adminService.blockUser(userId);
      await loadUsers();
    } catch (e) {
      setError(e.message || "Failed to block user");
    }
  }

  async function unblock(userId) {
    try {
      await adminService.unblockUser(userId);
      await loadUsers();
    } catch (e) {
      setError(e.message || "Failed to unblock user");
    }
  }

  async function removeUser(userId) {
    if (!confirm("Delete this user?")) return;
    try {
      await adminService.deleteUser(userId);
      await loadUsers();
    } catch (e) {
      setError(e.message || "Failed to delete user");
    }
  }

  async function createTag(event) {
    event.preventDefault();
    if (!newTag.trim()) return;
    try {
      await tagService.create(newTag.trim());
      setNewTag("");
      await loadTags();
    } catch (e) {
      setError(e.message || "Failed to create tag");
    }
  }

  async function deleteTag(tagId) {
    try {
      await tagService.remove(tagId);
      await loadTags();
    } catch (e) {
      setError(e.message || "Failed to delete tag");
    }
  }

  if (loading) {
    return (
      <section className="page-container">
        <div className="content-card">Loading admin panel...</div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <div className="content-card">
        <p className="section-kicker">Admin</p>
        <h1>Admin Panel</h1>
        <p>Manage users and tags from backend-powered controls.</p>

        <div className="tag-row" style={{ marginBottom: "1rem" }}>
          <span className="tag-chip">Users: {totals.totalUsers}</span>
          <span className="tag-chip">Blocked: {totals.blockedUsers}</span>
          <span className="tag-chip">Tags: {totals.totalTags}</span>
        </div>

        <div className="filter-tabs">
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
          <button className={activeTab === "tags" ? "active" : ""} onClick={() => setActiveTab("tags")}>Tags</button>
        </div>
      </div>

      {error ? <div className="content-card"><p className="input-error">{error}</p></div> : null}

      {activeTab === "users" ? (
        <div className="content-card">
          <h2>User Management</h2>
          <div className="event-detail-list">
            {users.map((user) => (
              <div key={user._id} className="event-detail-list__item">
                <strong>{user.fullName}</strong>
                <p>{user.email} · {user.role} · {user.university || "No university"}</p>
                <div className="tag-row">
                  {user.isBlocked ? (
                    <button onClick={() => unblock(user._id)}>Unblock</button>
                  ) : (
                    <button onClick={() => block(user._id)}>Block</button>
                  )}
                  <button className="danger" onClick={() => removeUser(user._id)}>Delete</button>
                </div>
              </div>
            ))}
            {users.length === 0 ? <p>No users found.</p> : null}
          </div>
        </div>
      ) : (
        <div className="content-card">
          <h2>Tag Management</h2>
          <form onSubmit={createTag} className="search-filter-row">
            <input value={newTag} onChange={(event) => setNewTag(event.target.value)} placeholder="Add tag name" />
            <button type="submit">Add Tag</button>
          </form>
          <div className="event-detail-list">
            {tags.map((tag) => (
              <div key={tag._id} className="event-detail-list__item">
                <strong>{tag.name}</strong>
                <div className="tag-row">
                  <button className="danger" onClick={() => deleteTag(tag._id)}>Delete</button>
                </div>
              </div>
            ))}
            {tags.length === 0 ? <p>No tags found.</p> : null}
          </div>
        </div>
      )}
    </section>
  );
}
