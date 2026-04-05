import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

export default function Tracking() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading live tracking...</div>;
  }

  return (
    <div className="page-stack">
      <PageSection title="Care timeline" subtitle="Track what happens from booking through aftercare.">
        <div className="timeline">
          {data.careTimeline.map((item) => (
            <article key={item.id} className={`timeline-item ${item.state}`}>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="Recent bookings" subtitle="Every scheduled task linked to your account.">
        <div className="card-grid">
          {data.bookings.map((booking) => (
            <article key={booking.id} className="panel">
              <h4>{booking.serviceId}</h4>
              <p>{booking.time}</p>
              <p>Status: {booking.status}</p>
              <p>{booking.note || "No extra notes shared."}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
