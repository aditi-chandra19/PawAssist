import { NavLink, Outlet, useLocation } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

const navigation = [
  { to: "/app/home", label: "Dashboard" },
  { to: "/app/pets", label: "Pets" },
  { to: "/app/booking", label: "Booking" },
  { to: "/app/tracking", label: "Tracking" },
  { to: "/app/health", label: "Health" },
  { to: "/app/grooming", label: "Grooming" },
  { to: "/app/provider", label: "Providers" },
  { to: "/app/chat", label: "Chat" },
  { to: "/app/community", label: "Community" },
  { to: "/app/wallet", label: "Wallet" },
  { to: "/app/insurance", label: "Insurance" },
  { to: "/app/premium", label: "Premium" },
  { to: "/app/ai-assistant", label: "AI Assist" },
  { to: "/app/notifications", label: "Alerts" },
];

export default function AppShell() {
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="eyebrow">PawAssist</span>
          <h1>Care that moves as fast as pet emergencies do.</h1>
          <p>One place for bookings, daily health logs, providers, and support.</p>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="profile-card">
          <div>
            <strong>{user?.name || "Pet Parent"}</strong>
            <p>
              {user?.city || "Kolkata"} • {user?.phone || "Local mode"}
            </p>
          </div>
          <button className="ghost-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div>
            <span className="eyebrow">Live workspace</span>
            <h2>{location.pathname.replace("/app/", "").replace("-", " ")}</h2>
          </div>
          <div className="status-pill">Realtime care dashboard</div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
