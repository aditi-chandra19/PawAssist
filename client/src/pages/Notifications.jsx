import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

export default function Notifications() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading alerts...</div>;
  }

  return (
    <div className="page-stack">
      <PageSection title="Notifications" subtitle="Important reminders, care updates, and account activity.">
        <div className="card-grid">
          {data.notifications.map((item) => (
            <article key={item.id} className={`panel priority-${item.priority}`}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <strong>{item.time}</strong>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
