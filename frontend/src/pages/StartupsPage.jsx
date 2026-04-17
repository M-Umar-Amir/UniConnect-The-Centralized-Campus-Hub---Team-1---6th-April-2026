import StartupCard from "../components/StartupCard";
import { startupItems } from "../data/mockAppData";

export default function StartupsPage() {
  return (
    <section className="page-container">
      <div className="content-card">
        <p className="section-kicker">Startups</p>
        <h1>Student ventures building on campus</h1>
        <p>Explore early products, the people behind them, and the roles they are currently hiring for.</p>
      </div>

      <div className="search-results-grid">
        {startupItems.map((startup) => (
          <StartupCard
            key={startup.id}
            startup={startup}
            onLike={() => Promise.resolve()}
            onViewPitch={() => {}}
          />
        ))}
      </div>
    </section>
  );
}
