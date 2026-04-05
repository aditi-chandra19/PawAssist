const methods = [
  { name: "Google Pay", detail: "UPI •••• 9876" },
  { name: "HDFC Credit Card", detail: "Card •••• 4532" },
  { name: "Paytm", detail: "Wallet" },
];

const transactions = [
  { title: "Vet Visit - Dr. Sharma", time: "Today, 3:00 PM", amount: "-Rs 499", type: "debit" },
  { title: "Grooming - Basic Package", time: "Yesterday, 11:30 AM", amount: "-Rs 199", type: "debit" },
  { title: "Refund - Cancelled Booking", time: "2 days ago", amount: "+Rs 299", type: "credit" },
  { title: "Medicine Delivery", time: "3 days ago", amount: "-Rs 149", type: "debit" },
  { title: "Pet Training Session", time: "5 days ago", amount: "-Rs 399", type: "debit" },
];

export default function Wallet() {
  return (
    <div className="care-page wallet-page">
      <header className="page-hero violet">
        <div>
          <h1>Wallet and Payments</h1>
        </div>
      </header>

      <section className="wallet-balance-card">
        <span>Available Balance</span>
        <strong>Rs 1,200</strong>
        <button className="wallet-add-button">+ Add Money</button>
      </section>

      <section className="wallet-summary-grid">
        <article className="wallet-summary-card">
          <span>This Month</span>
          <strong>Rs 2,450</strong>
          <p>12% from last month</p>
        </article>
        <article className="wallet-summary-card">
          <span>Total Savings</span>
          <strong>Rs 890</strong>
          <p>from offers and cashback</p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Payment Methods</h2>
          <button className="text-button">+ Add New</button>
        </div>
        <div className="method-list">
          {methods.map((method) => (
            <article key={method.name} className="method-card">
              <div className="method-left">
                <div className="method-icon">C</div>
                <div>
                  <strong>{method.name}</strong>
                  <p>{method.detail}</p>
                </div>
              </div>
              <span className="method-action">Edit</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Recent Transactions</h2>
        </div>
        <div className="transaction-list">
          {transactions.map((item) => (
            <article key={`${item.title}-${item.time}`} className="transaction-card">
              <div className="method-left">
                <div className={`transaction-icon ${item.type}`}>{item.type === "credit" ? "+" : "-"}</div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.time}</p>
                </div>
              </div>
              <strong className={item.type === "credit" ? "credit-amount" : "debit-amount"}>
                {item.amount}
              </strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

