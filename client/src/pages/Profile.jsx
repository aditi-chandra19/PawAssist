import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiBell, FiChevronRight, FiCreditCard, FiDownload, FiGlobe, FiLock, FiMail, FiMapPin, FiPhone, FiTrash2, FiUser, FiX } from "react-icons/fi";
import { buildFallbackOverview } from "../services/fallbackData";
import { updateProfile } from "../services/profileService";
import { removeAccount } from "../services/settingsService";
import useSettingsStore from "../store/useSettingsStore";
import useUserStore from "../store/useUserStore";

const tabItems = [
  { id: "profile", label: "Profile Settings", icon: FiUser, tone: "teal" },
  { id: "notifications", label: "Notifications", icon: FiBell, tone: "brand" },
  { id: "privacy", label: "Privacy & Security", icon: FiLock, tone: "sage" },
  { id: "payment", label: "Payment Methods", icon: FiCreditCard, tone: "clay" },
  { id: "preferences", label: "Preferences", icon: FiGlobe, tone: "sky" },
];

const helpItems = [
  {
    id: "faq",
    title: "FAQ & Help Center",
    body: "PawAssist connects your bookings, records, insurance, and support in one place. You can use this section to understand care flows, booking changes, wallet transactions, and how claims are processed.",
  },
  {
    id: "support",
    title: "Contact Support",
    body: "For urgent app issues, use the in-app chat or email support@pawassist.app. Standard response windows are usually within a few working hours, while emergency-care booking concerns should go through the emergency support lane.",
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    body: "Bookings, insurance examples, and rewards shown in demo mode are illustrative. Real service fulfilment, pricing, availability, and partner policies depend on your selected provider, plan, and account status.",
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    body: "Your local preferences, payment method labels, and account settings stay stored on this device unless synced through a live backend. You can download your data any time or delete the local account from Account Actions.",
  },
];

const defaultCardForm = { label: "", detail: "", type: "Card" };
const defaultPasswordForm = { current: "", next: "", confirm: "" };

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const logout = useUserStore((state) => state.logout);

  const {
    language,
    currency,
    themeMode,
    notificationPrefs,
    privacy,
    paymentMethods,
    accountPassword,
    setLanguage,
    setCurrency,
    setThemeMode,
    setNotificationPref,
    setPrivacy,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    changePassword,
    resetSettings,
    exportSettingsSnapshot,
  } = useSettingsStore();

  const activeTab = tabItems.some((item) => item.id === searchParams.get("tab"))
    ? searchParams.get("tab")
    : "profile";
  const [expandedHelp, setExpandedHelp] = useState("terms");
  const [savedMessage, setSavedMessage] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Ayush Sharma",
    email: user?.email || "ayush@example.com",
    phone: user?.phone || "+91 98765 43210",
    city: user?.city || "Mumbai, Maharashtra, India",
  });
  const [passwordForm, setPasswordForm] = useState(defaultPasswordForm);
  const [cardForm, setCardForm] = useState(defaultCardForm);

  const initials = useMemo(
    () =>
      (profileForm.name || "Pet Parent")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [profileForm.name],
  );

  const saveProfile = async () => {
    const nextUser = {
      ...user,
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      city: profileForm.city.trim(),
    };

    updateUser(nextUser);

    try {
      if (user?.id) {
        await updateProfile(nextUser);
      }
    } catch (error) {
      console.error("Profile sync failed:", error);
    }

    setIsEditingProfile(false);
    setSavedMessage("Profile settings updated.");
  };

  const downloadMyData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: profileForm,
      settings: exportSettingsSnapshot(),
      overview: buildFallbackOverview(user),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pawassist-account-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setSavedMessage("Your account data download has started.");
  };

  const handlePasswordSave = async () => {
    if (!user?.id && passwordForm.current !== accountPassword) {
      setSavedMessage("Current password is incorrect.");
      return;
    }

    if (!passwordForm.next || passwordForm.next.length < 6) {
      setSavedMessage("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setSavedMessage("Password confirmation does not match.");
      return;
    }

    try {
      await changePassword(passwordForm.current, passwordForm.next);
      setPasswordForm(defaultPasswordForm);
      setIsPasswordOpen(false);
      setSavedMessage("Password changed successfully.");
    } catch (error) {
      setSavedMessage(error?.response?.data?.message || "Unable to change password right now.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (user?.id) {
        await removeAccount();
      }
    } catch (error) {
      console.error("Account deletion sync failed:", error);
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("pawassist.local.bookings");
    }
    logout();
    resetSettings();
    navigate("/login");
  };

  const handleLogoutOnly = () => {
    logout();
    navigate("/login");
  };

  const handleAddCard = () => {
    if (!cardForm.label.trim() || !cardForm.detail.trim()) {
      setSavedMessage("Enter the payment method details first.");
      return;
    }

    addPaymentMethod({
      id: `pm-${Date.now()}`,
      label: cardForm.label.trim(),
      detail: cardForm.detail.trim(),
      type: cardForm.type,
      defaultMethod: false,
    });
    setCardForm(defaultCardForm);
    setIsCardOpen(false);
    setSavedMessage("Payment method added.");
  };

  const toggleHelp = (id) => {
    setExpandedHelp((current) => (current === id ? "" : id));
  };

  const handleTabSelect = (tabId) => {
    setSearchParams(tabId === "profile" ? {} : { tab: tabId });
  };

  return (
    <div className="settings-page">
      <header className="settings-hero">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and settings.</p>
        </div>
      </header>

      {savedMessage ? <div className="settings-toast">{savedMessage}</div> : null}

      <div className="settings-layout">
        <aside className="settings-sidebar">
          {tabItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} type="button" className={`settings-tab ${activeTab === item.id ? `active ${item.tone}` : ""}`} onClick={() => handleTabSelect(item.id)}>
                <span className={`settings-tab-icon ${item.tone}`}><Icon /></span>
                {item.label}
              </button>
            );
          })}
          <button type="button" className="settings-logout-button" onClick={handleLogoutOnly}>
            <span className="settings-tab-icon danger"><FiX /></span>
            Logout
          </button>
        </aside>

        <div className="settings-content">
          {activeTab === "profile" ? (
            <>
              <section className="settings-panel">
                <div className="settings-profile-head">
                  <div className="settings-profile-title">
                    <div className="settings-avatar">{initials}</div>
                    <div>
                      <strong>{profileForm.name}</strong>
                      <p>Premium Member since Jan 2026</p>
                    </div>
                  </div>
                  {isEditingProfile ? (
                    <div className="settings-actions">
                      <button type="button" className="settings-secondary-button" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                      <button type="button" className="settings-primary-button" onClick={saveProfile}>Save Changes</button>
                    </div>
                  ) : (
                    <button type="button" className="settings-primary-button" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
                  )}
                </div>

                <div className="settings-form-grid">
                  {[
                    { key: "name", label: "Full Name", icon: FiUser },
                    { key: "email", label: "Email Address", icon: FiMail },
                    { key: "phone", label: "Phone Number", icon: FiPhone },
                    { key: "city", label: "Address", icon: FiMapPin },
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <label key={field.key} className="settings-field">
                        <span><Icon /> {field.label}</span>
                        <input
                          value={profileForm[field.key]}
                          onChange={(event) => setProfileForm((current) => ({ ...current, [field.key]: event.target.value }))}
                          disabled={!isEditingProfile}
                        />
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="settings-panel">
                <h2>Account Actions</h2>
                <div className="settings-action-list">
                  <button type="button" onClick={() => setIsPasswordOpen(true)}>
                    <span>Change Password</span>
                    <FiChevronRight />
                  </button>
                  <button type="button" onClick={downloadMyData}>
                    <span>Download My Data</span>
                    <FiDownload />
                  </button>
                  <button type="button" className="danger" onClick={handleDeleteAccount}>
                    <span>Delete Account</span>
                    <FiTrash2 />
                  </button>
                </div>
              </section>
            </>
          ) : null}

          {activeTab === "notifications" ? (
            <section className="settings-panel">
              <h2>Notification Preferences</h2>
              <div className="settings-toggle-list">
                {[
                  ["bookingUpdates", "Booking Updates"],
                  ["serviceReminders", "Service Reminders"],
                  ["promotions", "Promotions"],
                  ["petHealthAlerts", "Pet Health Alerts"],
                  ["communityUpdates", "Community Updates"],
                  ["emailNotifications", "Email Notifications"],
                  ["pushNotifications", "Push Notifications"],
                  ["smsNotifications", "Sms Notifications"],
                ].map(([key, label]) => (
                  <div key={key} className="settings-toggle-row">
                    <div>
                      <strong>{label}</strong>
                      <p>Receive updates about this category</p>
                    </div>
                    <button type="button" className={`settings-switch${notificationPrefs[key] ? " on" : ""}`} onClick={() => setNotificationPref(key, !notificationPrefs[key])}>
                      <span />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "privacy" ? (
            <>
              <section className="settings-panel">
                <h2>Privacy & Security</h2>
                <div className="settings-visibility-row">
                  {["public", "friends", "private"].map((value) => (
                    <button key={value} type="button" className={privacy.visibility === value ? "active" : ""} onClick={() => setPrivacy("visibility", value)}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="settings-toggle-list">
                  {[
                    ["showEmail", "Show Email"],
                    ["showPhone", "Show Phone"],
                    ["allowMessages", "Allow Messages"],
                    ["dataSharing", "Data Sharing"],
                  ].map(([key, label]) => (
                    <div key={key} className="settings-toggle-row">
                      <strong>{label}</strong>
                      <button type="button" className={`settings-switch${privacy[key] ? " on" : ""}`} onClick={() => setPrivacy(key, !privacy[key])}>
                        <span />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="settings-security-card">
                <span className="settings-security-icon"><FiLock /></span>
                <div>
                  <strong>Your Data is Secure</strong>
                  <p>We use local persistence and encrypted browser storage patterns to protect your settings and preferences in this demo flow.</p>
                </div>
              </section>
            </>
          ) : null}

          {activeTab === "payment" ? (
            <section className="settings-panel">
              <div className="settings-panel-head">
                <h2>Saved Payment Methods</h2>
                <button type="button" className="settings-primary-button clay" onClick={() => setIsCardOpen(true)}>Add New Card</button>
              </div>
              <div className="settings-payment-list">
                {paymentMethods.map((method) => (
                  <article key={method.id} className="settings-payment-card">
                    <div className="settings-payment-left">
                      <span className="settings-payment-icon"><FiCreditCard /></span>
                      <div>
                        <strong>{method.label}</strong>
                        <p>{method.detail}</p>
                      </div>
                    </div>
                    <div className="settings-payment-actions">
                      <button type="button" className={method.defaultMethod ? "is-default" : ""} onClick={() => setDefaultPaymentMethod(method.id)}>
                        {method.defaultMethod ? "Default" : "Use Now"}
                      </button>
                      <button type="button" className="danger-icon" onClick={() => removePaymentMethod(method.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "preferences" ? (
            <>
              <section className="settings-panel">
                <h2>App Preferences</h2>
                <div className="settings-form-grid">
                  <label className="settings-field">
                    <span>Language</span>
                    <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </label>
                  <label className="settings-field">
                    <span>Currency</span>
                    <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                    <option>INR (Rs)</option>
                      <option>USD ($)</option>
                    </select>
                  </label>
                </div>

                <div className="settings-theme-group">
                  <span>Theme</span>
                  <div className="settings-theme-options">
                    {["light", "dark", "auto"].map((option) => (
                      <button key={option} type="button" className={themeMode === option ? "active" : ""} onClick={() => setThemeMode(option)}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="settings-panel">
                <h2>Help & Support</h2>
                <div className="settings-help-list">
                  {helpItems.map((item) => (
                    <div key={item.id} className={`settings-help-item${expandedHelp === item.id ? " open" : ""}`}>
                      <button type="button" onClick={() => toggleHelp(item.id)}>
                        <span>{item.title}</span>
                        <FiChevronRight />
                      </button>
                      {expandedHelp === item.id ? <p>{item.body}</p> : null}
                    </div>
                  ))}
                </div>
              </section>

              <section className="settings-version-card">
                <span>PawAssist Version</span>
                <strong>v2.5.1</strong>
              </section>
            </>
          ) : null}
        </div>
      </div>

      {isPasswordOpen ? (
        <div className="settings-modal-overlay" role="presentation" onClick={() => setIsPasswordOpen(false)}>
          <div className="settings-modal-card" role="dialog" aria-modal="true" aria-label="Change password" onClick={(event) => event.stopPropagation()}>
            <div className="settings-modal-head">
              <h2>Change Password</h2>
              <button type="button" onClick={() => setIsPasswordOpen(false)}><FiX /></button>
            </div>
            {[
              ["current", "Current Password"],
              ["next", "New Password"],
              ["confirm", "Confirm Password"],
            ].map(([key, label]) => (
              <label key={key} className="settings-field">
                <span>{label}</span>
                <input type="password" value={passwordForm[key]} onChange={(event) => setPasswordForm((current) => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
            <div className="settings-actions">
              <button type="button" className="settings-secondary-button" onClick={() => setIsPasswordOpen(false)}>Cancel</button>
              <button type="button" className="settings-primary-button" onClick={handlePasswordSave}>Save</button>
            </div>
          </div>
        </div>
      ) : null}

      {isCardOpen ? (
        <div className="settings-modal-overlay" role="presentation" onClick={() => setIsCardOpen(false)}>
          <div className="settings-modal-card" role="dialog" aria-modal="true" aria-label="Add payment method" onClick={(event) => event.stopPropagation()}>
            <div className="settings-modal-head">
              <h2>Add New Card</h2>
              <button type="button" onClick={() => setIsCardOpen(false)}><FiX /></button>
            </div>
            <label className="settings-field">
              <span>Card Label</span>
              <input value={cardForm.label} onChange={(event) => setCardForm((current) => ({ ...current, label: event.target.value }))} placeholder="Visa Platinum" />
            </label>
            <label className="settings-field">
              <span>Card / UPI Details</span>
              <input value={cardForm.detail} onChange={(event) => setCardForm((current) => ({ ...current, detail: event.target.value }))} placeholder="•••• 1122 • Exp: 03/28" />
            </label>
            <label className="settings-field">
              <span>Type</span>
              <select value={cardForm.type} onChange={(event) => setCardForm((current) => ({ ...current, type: event.target.value }))}>
                <option>Card</option>
                <option>UPI</option>
                <option>Wallet</option>
              </select>
            </label>
            <div className="settings-actions">
              <button type="button" className="settings-secondary-button" onClick={() => setIsCardOpen(false)}>Cancel</button>
              <button type="button" className="settings-primary-button clay" onClick={handleAddCard}>Add Card</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
