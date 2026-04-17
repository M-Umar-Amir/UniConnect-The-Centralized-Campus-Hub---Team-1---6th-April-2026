import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { buildSearchResults } from "../data/mockAppData";

const tabs = ["All", "Events", "People", "Startups"];

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("All");
  const [eventType, setEventType] = useState("All");
  const [peopleRole, setPeopleRole] = useState("All");
  const [startupDomain, setStartupDomain] = useState("All");

  const results = useMemo(() => buildSearchResults(query), [query]);

  const filtered = useMemo(() => {
    const filteredEvents =
      eventType === "All" ? results.events : results.events.filter((event) => event.eventType === eventType);
    const filteredPeople =
      peopleRole === "All" ? results.people : results.people.filter((person) => person.role === peopleRole);
    const filteredStartups =
      startupDomain === "All"
        ? results.startups
        : results.startups.filter((startup) => startup.domains.includes(startupDomain));

    return {
      events: filteredEvents,
      people: filteredPeople,
      startups: filteredStartups
    };
  }, [eventType, peopleRole, results, startupDomain]);

  const visibleItems = {
    All: [...filtered.events, ...filtered.people, ...filtered.startups],
    Events: filtered.events,
    People: filtered.people,
    Startups: filtered.startups
  }[activeTab];

  return (
    <section className="page-container">
      <div className="content-card search-results-card">
        <p className="section-kicker">Search</p>
        <h1>Results for "{query || "everything"}"</h1>
        <p>Explore events, people, and startups from one search surface.</p>

        <div className="filter-tabs">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Events" ? (
          <div className="search-filter-row">
            <select value={eventType} onChange={(event) => setEventType(event.target.value)}>
              {["All", "Networking", "Hackathon", "Showcase", "Summit"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {activeTab === "People" ? (
          <div className="search-filter-row">
            <select value={peopleRole} onChange={(event) => setPeopleRole(event.target.value)}>
              {["All", "UI/UX Designer", "Founder at BuildFast", "CS Society Lead"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {activeTab === "Startups" ? (
          <div className="search-filter-row">
            <select value={startupDomain} onChange={(event) => setStartupDomain(event.target.value)}>
              {["All", "AI", "EdTech", "Commerce", "Operations"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {visibleItems.length === 0 ? (
        <div className="content-card">
          <h2>No results found</h2>
          <p>Try a broader term or switch tabs to explore other result types.</p>
        </div>
      ) : (
        <div className="search-results-grid">
          {(activeTab === "All" || activeTab === "Events") &&
            filtered.events.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="content-card search-item-card">
                <p className="section-kicker">Event</p>
                <h3>{event.title}</h3>
                <p>{event.society}</p>
                <p>{event.description}</p>
              </Link>
            ))}

          {(activeTab === "All" || activeTab === "People") &&
            filtered.people.map((person) => (
              <Link key={person.id} to={`/profile/${person.id}`} className="content-card search-item-card">
                <p className="section-kicker">Person</p>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
                <p>{person.university}</p>
              </Link>
            ))}

          {(activeTab === "All" || activeTab === "Startups") &&
            filtered.startups.map((startup) => (
              <div key={startup.id} className="content-card search-item-card">
                <p className="section-kicker">Startup</p>
                <h3>{startup.name}</h3>
                <p>{startup.founder}</p>
                <p>{startup.summary}</p>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
