import { Link } from "react-router-dom";
import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

export default function Dashboard() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading your care dashboard...</div>;
  }

  const nextBooking = data.bookings[0];

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Today&apos;s snapshot</span>
          <h1>{data.user.name}, your pets are covered.</h1>
          <p>
            Track appointments, get urgent help, and stay on top of daily care
            without switching between apps.
          </p>
        </div>
        <div className="hero-metrics">
          <div className="metric-tile">
            <span>Active bookings</span>
            <strong>{data.stats.activeBookings}</strong>
          </div>
          <div className="metric-tile">
            <span>Reward points</span>
            <strong>{data.stats.rewardPoints}</strong>
          </div>
          <div className="metric-tile">
            <span>Unread messages</span>
            <strong>{data.stats.unreadMessages}</strong>
          </div>
        </div>
      </section>

      <div className="stats-grid">
        {data.services.map((service) => (
          <article key={service.id} className="service-card">
            <span className="service-badge" style={{ backgroundColor: service.accent }}>
              {service.category}
            </span>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-meta">
              <strong>Rs {service.price}</strong>
              <span>{service.eta}</span>
            </div>
          </article>
        ))}
      </div>

      <PageSection
        title="Next booking"
        subtitle="The most important upcoming care task."
        actions={<Link className="ghost-button" to="/app/booking">Book another</Link>}
      >
        {nextBooking ? (
          <div className="panel">
            <strong>{nextBooking.time} tomorrow</strong>
            <p>{nextBooking.note || "Provider will confirm final checklist in chat."}</p>
          </div>
        ) : (
          <div className="panel">No upcoming booking yet.</div>
        )}
      </PageSection>

      <PageSection title="Pet family" subtitle="Daily care at a glance">
        <div className="card-grid">
          {data.pets.map((pet) => (
            <article key={pet.id} className="panel">
              <h4>{pet.name}</h4>
              <p>
                {pet.type} • {pet.age}
              </p>
              <p>{pet.nextCare}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
