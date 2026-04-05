import { useEffect, useState } from "react";
import useAppData from "../services/useAppData";
import { updateProfile } from "../services/profileService";
import useUserStore from "../store/useUserStore";

const defaultForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  petName: "",
  notes: "",
};

export default function Profile() {
  const { data, loading } = useAppData();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [form, setForm] = useState(defaultForm);

  const activeUser = user || data?.user;
  const primaryPet = data?.pets?.[0];

  useEffect(() => {
    if (!activeUser) {
      return;
    }

    setForm({
      name: activeUser.name || "",
      phone: activeUser.phone || "",
      email: activeUser.email || "care@pawassist.app",
      city: activeUser.city || "Kolkata",
      petName: activeUser.petName || primaryPet?.name || "",
      notes: activeUser.notes || "Appointments, health reminders, and support updates",
    });
  }, [activeUser, primaryPet]);

  if (loading || !data) {
    return <div className="panel">Loading your profile...</div>;
  }

  const initials = (activeUser?.name || "Pet Parent")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (field) => (event) => {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSavedMessage("");
    setForm({
      name: activeUser?.name || "",
      phone: activeUser?.phone || "",
      email: activeUser?.email || "care@pawassist.app",
      city: activeUser?.city || "Kolkata",
      petName: activeUser?.petName || primaryPet?.name || "",
      notes: activeUser?.notes || "Appointments, health reminders, and support updates",
    });
  };

  const handleSave = async () => {
    const nextUser = {
      name: form.name.trim() || "Pet Parent",
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      petName: form.petName.trim(),
      notes: form.notes.trim(),
    };

    updateUser(nextUser);

    try {
      if (activeUser?.id) {
        const response = await updateProfile(activeUser.id, nextUser);
        updateUser(response.user);
      }
    } catch (error) {
      console.error("Profile sync failed:", error);
    }

    setIsEditing(false);
    setSavedMessage("Profile updated successfully.");
  };

  return (
    <div className="care-page profile-page">
      <header className="page-hero compact">
        <div>
          <h1>My Profile</h1>
          <p>Your parent profile, contact details, and care account overview.</p>
        </div>
        <div className="section-actions">
          {isEditing ? (
            <>
              <button type="button" className="ghost-button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleSave}>
                Save Profile
              </button>
            </>
          ) : (
            <button type="button" className="primary-button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </header>

      {savedMessage ? <p className="success-text">{savedMessage}</p> : null}

      <section className="section-block profile-overview-grid">
        <article className="profile-card">
          <div className="profile-identity-row">
            <div className="profile-avatar-large">{initials}</div>
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
              <strong>{activeUser?.city || "Kolkata"}</strong>
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
          {isEditing ? (
            <>
              <label className="form-field">
                <span>Full Name</span>
                <input value={form.name} onChange={handleChange("name")} placeholder="Your full name" />
              </label>
              <label className="form-field">
                <span>Phone</span>
                <input value={form.phone} onChange={handleChange("phone")} placeholder="+91 98765 43210" />
              </label>
              <label className="form-field">
                <span>Email</span>
                <input value={form.email} onChange={handleChange("email")} placeholder="you@example.com" />
              </label>
              <label className="form-field">
                <span>City</span>
                <input value={form.city} onChange={handleChange("city")} placeholder="Kolkata" />
              </label>
              <label className="form-field">
                <span>Notification Preferences</span>
                <textarea
                  className="app-textarea"
                  value={form.notes}
                  onChange={handleChange("notes")}
                  placeholder="Appointments, reminders, and support updates"
                />
              </label>
            </>
          ) : (
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
                <strong>{activeUser?.notes || "Appointments, health reminders, and support updates"}</strong>
              </div>
            </div>
          )}
        </article>

        <article className="section-block profile-pet-highlight">
          <h2>Primary Pet</h2>
          {isEditing ? (
            <>
              <label className="form-field">
                <span>Primary Pet Name</span>
                <input value={form.petName} onChange={handleChange("petName")} placeholder="Bruno" />
              </label>
              <p className="profile-pet-edit-note">
                This updates your profile display. Pet records remain separate from booking and health data.
              </p>
            </>
          ) : primaryPet ? (
            <div className="profile-pet-row">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80"
                alt={form.petName || primaryPet.name}
                className="profile-pet-image"
              />
              <div>
                <strong>{activeUser?.petName || primaryPet.name}</strong>
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
