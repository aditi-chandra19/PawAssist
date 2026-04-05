import useAppData from "../services/useAppData";
import useUserStore from "../store/useUserStore";

export default function Profile() {
  const { data, loading } = useAppData();
  const user = useUserStore((state) => state.user);

  if (loading || !data) {
    return <div className="panel">Loading your profile...</div>;
  }

  const activeUser = user || data.user;
  const primaryPet = data.pets[0];

  return (
    <div className="care-page profile-page">
      <header className="page-hero compact">
        <div>
          <h1>My Profile</h1>
          <p>Your parent profile, contact details, and care account overview.</p>
        </div>
      </header>

      <section className="section-block profile-overview-grid">
        <article className="profile-card">
          <div className="profile-identity-row">
            <div className="profile-avatar-large">{(activeUser?.name || "Pet Parent").slice(0, 2).toUpperCase()}</div>
            <div>
              <h2>{activeUser?.name || "Pet Parent"}</h2>
              <p>{activeUser?.phone || "Local mode account"}</p>
            </div>
          </div>
          <div className="profile-detail-list">
            <div>
              <span>Account Type</span>
              <strong>Premium-ready pet parent</strong>
            </div>
            <div>
              <span>Primary City</span>
              <strong>Jaipur, India</strong>
            </div>
            <div>
              <span>Care ID</span>
              <strong>{activeUser?.id || "local-user"}</strong>
            </div>
          </div>
        </article>

        <article className="section-block profile-summary-card">
          <h2>Account Snapshot</h2>
          <div className="booking-summary-grid">
            <div>
              <span>Pets</span>
              <strong>{data.pets.length}</strong>
            </div>
            <div>
              <span>Bookings</span>
              <strong>{data.bookings.length}</strong>
            </div>
            <div>
              <span>Reward Points</span>
              <strong>{data.stats.rewardPoints}</strong>
            </div>
            <div>
              <span>Unread Messages</span>
              <strong>{data.stats.unreadMessages}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="section-block profile-overview-grid">
        <article className="section-block">
          <h2>Contact and Preferences</h2>
          <div className="profile-detail-list">
            <div>
              <span>Phone</span>
              <strong>{activeUser?.phone || "Not available"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{activeUser?.email || "care@pawassist.app"}</strong>
            </div>
            <div>
              <span>Notifications</span>
              <strong>Appointments, health reminders, and support updates</strong>
            </div>
          </div>
        </article>

        <article className="section-block profile-pet-highlight">
          <h2>Primary Pet</h2>
          {primaryPet ? (
            <div className="profile-pet-row">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80"
                alt={primaryPet.name}
                className="profile-pet-image"
              />
              <div>
                <strong>{primaryPet.name}</strong>
                <p>{primaryPet.type} companion</p>
                <span>Next step: wellness review and routine checkup planning.</span>
              </div>
            </div>
          ) : (
            <p>No pets added yet.</p>
          )}
        </article>
      </section>
    </div>
  );
}
