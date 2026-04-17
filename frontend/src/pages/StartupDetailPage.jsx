import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { startupService } from "../services/startupService";

export default function StartupDetailPage() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyMessage, setApplyMessage] = useState("");

  async function loadStartup() {
    try {
      setLoading(true);
      setError("");
      const payload = await startupService.getById(id);
      setStartup(payload.startup || null);
    } catch (e) {
      setError(e.message || "Failed to load startup");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStartup();
  }, [id]);

  async function apply() {
    try {
      await startupService.apply(id, { role: "Contributor", message: "Interested in joining" });
      setApplyMessage("Request sent successfully.");
    } catch (e) {
      setApplyMessage(e.message || "Could not send request");
    }
  }

  if (loading) {
    return <section className="page-container"><div className="content-card">Loading startup...</div></section>;
  }

  if (error || !startup) {
    return (
      <section className="page-container">
        <div className="content-card">
          <h1>Startup not found</h1>
          <p>{error || "This startup is unavailable."}</p>
          <Link to="/startups" className="primary-page-button">Back to Startups</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <div className="content-card">
        <p className="section-kicker">Startup Detail</p>
        <h1>{startup.name}</h1>
        <p>{startup.tagline || "No tagline provided."}</p>
        <p><strong>Founder:</strong> {startup.founder?.fullName || "Unknown"}</p>
        <div className="tag-row">
          {(startup.domains || []).map((item) => <span className="tag-chip" key={item}>{item}</span>)}
        </div>
        <p>{startup.problemStatement || startup.summary || "No pitch content provided yet."}</p>
        <button className="primary-page-button" onClick={apply}>Request to Join</button>
        {applyMessage ? <p className="muted">{applyMessage}</p> : null}
      </div>
    </section>
  );
}
