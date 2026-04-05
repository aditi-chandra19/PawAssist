const monthData = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 42 },
  { label: "Mar", value: 38 },
  { label: "Apr", value: 54 },
  { label: "May", value: 49 },
  { label: "Now", value: 58 },
];

const weekData = [
  { label: "Mon", value: 40 },
  { label: "Tue", value: 54 },
  { label: "Wed", value: 48 },
  { label: "Thu", value: 52 },
  { label: "Fri", value: 61 },
  { label: "Sat", value: 72 },
  { label: "Sun", value: 68 },
];

const schedule = [
  { vaccine: "Rabies Booster", date: "Apr 10, 2026", status: "Upcoming" },
  { vaccine: "Distemper", date: "May 15, 2026", status: "Upcoming" },
  { vaccine: "Parvovirus", date: "Jan 20, 2026", status: "Completed" },
];

const dietPlan = [
  { meal: "Breakfast", detail: "Royal Canin Adult - 150g" },
  { meal: "Lunch", detail: "Chicken and Rice - 200g" },
  { meal: "Dinner", detail: "Royal Canin Adult - 150g" },
  { meal: "Snacks", detail: "Dental Chews, Carrots" },
];

export default function Health() {
  return (
    <div className="care-page health-page">
      <header className="page-hero violet">
        <div>
          <h1>Health Tracker</h1>
          <p>Bruno's health dashboard</p>
        </div>
      </header>

      <section className="health-pet-strip">
        <img
          src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80"
          alt="Bruno"
          className="health-pet-avatar"
        />
        <div>
          <h2>Bruno</h2>
          <p>Labrador • 3 Years</p>
        </div>
      </section>

      <section className="stats-three">
        <article className="metric-panel">
          <span>Weight</span>
          <strong>25 kg</strong>
          <p>+0.5 kg</p>
        </article>
        <article className="metric-panel">
          <span>Activity</span>
          <strong>8,543</strong>
          <p>steps today</p>
        </article>
        <article className="metric-panel">
          <span>Calories</span>
          <strong>1,250</strong>
          <p>kcal/day</p>
        </article>
      </section>

      <section className="chart-card">
        <div className="section-title-row">
          <h2>Weight Tracking</h2>
        </div>
        <div className="bar-chart">
          {monthData.map((item) => (
            <div key={item.label} className="bar-chart-item">
              <div className="bar-track">
                <div className="bar-fill emerald" style={{ height: `${item.value}%` }} />
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="chart-card">
        <div className="section-title-row">
          <h2>Weekly Activity</h2>
        </div>
        <div className="line-chart">
          {weekData.map((item) => (
            <div key={item.label} className="line-chart-item">
              <div className="line-chart-bar" style={{ height: `${item.value}%` }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="split-panels">
        <section className="info-card">
          <h2>Vaccination Schedule</h2>
          <div className="bullet-list">
            {schedule.map((item) => (
              <div key={item.vaccine} className="bullet-row">
                <div>
                  <strong>{item.vaccine}</strong>
                  <p>{item.date}</p>
                </div>
                <span className={`status-tag ${item.status === "Completed" ? "success" : "warning"}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="info-card">
          <h2>Diet Plan</h2>
          <div className="bullet-list">
            {dietPlan.map((item) => (
              <div key={item.meal} className="bullet-row">
                <strong>{item.meal}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

