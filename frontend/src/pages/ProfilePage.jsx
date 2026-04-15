import { Link, useSearchParams } from "react-router-dom";

const demoUsers = [
  {
    id: 1,
    name: "Amina Khan",
    email: "amina.khan@uniconnect.test",
    role: "Student",
    university: "University of Central Punjab",
    followers: 42,
    following: 18
  },
  {
    id: 2,
    name: "Zain Abbas",
    email: "zain.abbas@uniconnect.test",
    role: "Founder",
    university: "Lahore University of Management Sciences",
    followers: 128,
    following: 34
  }
];

export default function PeoplePage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim().toLowerCase() || "";

  const filteredUsers = query
    ? demoUsers.filter((user) => {
        const haystack = `${user.name} ${user.email} ${user.role} ${user.university}`.toLowerCase();
        return haystack.includes(query);
      })
    : demoUsers;

  return (
    <div className="page-container">
      <h1>👥 People</h1>
      {query && <p>Showing results for “{query}”.</p>}
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div key={user.id} className="content-card">
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>University:</strong> {user.university}</p>
            <p><strong>Followers:</strong> {user.followers}</p>
            <p><strong>Following:</strong> {user.following}</p>
            <button className="btn-primary">View Profile</button>
          </div>
        ))
      ) : (
        <div className="content-card">
          <h2>No people found</h2>
          <p>No demo user matched your search.</p>
          <Link to="/profile/me" className="btn-primary">Show all people</Link>
        </div>
      )}
    </div>
  );
}
