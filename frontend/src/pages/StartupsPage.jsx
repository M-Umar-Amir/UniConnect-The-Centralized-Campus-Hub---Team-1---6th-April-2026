import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StartupCard from "../components/StartupCard";
import { startupService } from "../services/startupService";

export default function StartupsPage() {
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadStartups() {
      try {
        setLoading(true);
        setLoadError("");
        const payload = await startupService.list();
        const items = payload.items || [];
        setStartups(
          items.map((item) => ({
            id: item._id,
            name: item.name,
            founder: item.founder?.fullName || "Unknown founder",
            tagline: item.tagline || item.summary || "No tagline provided",
            domains: item.domains || [],
            rolesNeeded: item.rolesNeeded || [],
            likes: item.likes || 0,
            liked: false
          }))
        );
      } catch (error) {
        setLoadError(error.message || "Failed to load startups");
      } finally {
        setLoading(false);
      }
    }

    loadStartups();
  }, []);

  return (
    <section className="page-container">
      <div className="content-card">
        <p className="section-kicker">Startups</p>
        <h1>Student ventures building on campus</h1>
        <p>Explore early products, the people behind them, and the roles they are currently hiring for.</p>
      </div>

      {loading ? <div className="content-card">Loading startups...</div> : null}
      {loadError ? <div className="content-card"><p className="input-error">{loadError}</p></div> : null}

      {!loading && !loadError ? (
        <div className="search-results-grid">
          {startups.map((startup) => (
            <StartupCard
              key={startup.id}
              startup={startup}
              onLike={() => Promise.resolve()}
              onViewPitch={(item) => navigate(`/startups/${item.id}`)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
