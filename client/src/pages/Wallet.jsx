import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowDownLeft, FiArrowUpRight, FiCalendar, FiCreditCard, FiDownload, FiGift, FiPlus, FiSearch, FiStar, FiX } from "react-icons/fi";

const startingMethods = [
  { id: "gpay", name: "Google Pay", detail: "UPI •••• 9876", kind: "UPI", defaultMethod: true },
  { id: "hdfc", name: "HDFC Credit Card", detail: "Card •••• 4532", kind: "Card" },
  { id: "paytm", name: "Paytm", detail: "Wallet", kind: "Wallet" },
  { id: "phonepe", name: "PhonePe", detail: "UPI •••• 8765", kind: "UPI" },
];

const startingTransactions = [
  { id: "txn-1", title: "Vet Consultation - Dr. Priya Sharma", date: "Apr 7, 2026", time: "3:00 PM", amount: -799, status: "Completed", category: "Veterinary", method: "Wallet", invoice: "INV-2026-4521" },
  { id: "txn-2", title: "Wallet Recharge", date: "Apr 6, 2026", time: "10:15 AM", amount: 2000, status: "Credited", category: "Top-up", method: "UPI", invoice: "TXN-2026-8934" },
  { id: "txn-3", title: "Premium Grooming - Luna", date: "Apr 5, 2026", time: "11:30 AM", amount: -1199, status: "Completed", category: "Grooming", method: "Wallet", invoice: "INV-2026-4498" },
  { id: "txn-4", title: "Refund - Cancelled Booking", date: "Apr 4, 2026", time: "2:45 PM", amount: 599, status: "Credited", category: "Refund", method: "Wallet", invoice: "REF-2026-1123" },
  { id: "txn-5", title: "Pet Training Session - Bruno", date: "Apr 3, 2026", time: "9:00 AM", amount: -899, status: "Completed", category: "Training", method: "Wallet", invoice: "INV-2026-4445" },
];

const startingOffers = [
  { id: "offer-1", title: "Get Rs 500 Cashback", detail: "Add Rs 2000 or more to wallet", badge: "25% OFF", validTill: "Apr 15, 2026", tone: "brand", reward: 500, kind: "cashback" },
  { id: "offer-2", title: "First Grooming Free", detail: "Book grooming service", badge: "100% OFF", validTill: "Apr 20, 2026", tone: "teal", reward: 0, kind: "service" },
  { id: "offer-3", title: "Rs 200 Off on Vet Visit", detail: "On bookings above Rs 500", badge: "Rs 200 OFF", validTill: "Apr 25, 2026", tone: "sage", reward: 200, kind: "discount" },
];

const startingRewards = [
  { id: "reward-1", title: "Booking Reward", date: "Apr 7, 2026", points: 25, type: "credit" },
  { id: "reward-2", title: "Referral Bonus", date: "Apr 5, 2026", points: 50, type: "credit" },
  { id: "reward-3", title: "Redeemed for Discount", date: "Apr 3, 2026", points: -100, type: "debit" },
  { id: "reward-4", title: "Premium Member Bonus", date: "Apr 1, 2026", points: 150, type: "credit" },
];

const spendBreakdown = [
  { label: "Veterinary", amount: 2499, percent: 41, tone: "teal" },
  { label: "Grooming", amount: 1799, percent: 29, tone: "brand" },
  { label: "Training", amount: 899, percent: 15, tone: "clay" },
  { label: "Medicine", amount: 649, percent: 10, tone: "sage" },
  { label: "Others", amount: 299, percent: 5, tone: "stone" },
];

const formatAmount = (amount) => `Rs ${Math.abs(amount).toLocaleString("en-IN")}`;

const createDownload = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function Wallet() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "rewards" || searchParams.get("tab") === "offers"
    ? "rewards"
    : searchParams.get("tab") === "transactions"
      ? "transactions"
      : "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [walletBalance, setWalletBalance] = useState(2450);
  const [rewardPoints, setRewardPoints] = useState(125);
  const [methods, setMethods] = useState(startingMethods);
  const [transactions, setTransactions] = useState(startingTransactions);
  const [offers, setOffers] = useState(startingOffers);
  const [rewardHistory, setRewardHistory] = useState(startingRewards);
  const [searchValue, setSearchValue] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("500");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const filteredTransactions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return transactions.filter((item) => {
      const matchesQuery = !query
        || [item.title, item.category, item.method, item.invoice].some((value) => value.toLowerCase().includes(query));
      const matchesType =
        transactionFilter === "all"
          ? true
          : transactionFilter === "credits"
            ? item.amount > 0
            : item.amount < 0;
      const matchesRange =
        dateRange === "all"
          ? true
          : dateRange === "recent"
            ? ["Apr 7, 2026", "Apr 6, 2026", "Apr 5, 2026"].includes(item.date)
            : ["Apr 4, 2026", "Apr 3, 2026"].includes(item.date);

      return matchesQuery && matchesType && matchesRange;
    });
  }, [dateRange, searchValue, transactionFilter, transactions]);

  const totalSpent = transactions
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const totalSavings = 1900;

  const announce = (message) => setStatusMessage(message);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === "overview" ? {} : { tab });
  };

  const handleAddMethod = () => {
    navigate("/app/settings?tab=payment");
  };

  const handleCycleFilter = () => {
    setTransactionFilter((current) =>
      current === "all" ? "debits" : current === "debits" ? "credits" : "all",
    );
  };

  const handleCycleDateRange = () => {
    setDateRange((current) =>
      current === "all" ? "recent" : current === "recent" ? "earlier" : "all",
    );
  };

  const downloadTransaction = (item) => {
    createDownload(
      `${item.invoice}.txt`,
      [
        "PawAssist Wallet Transaction",
        `Title: ${item.title}`,
        `Date: ${item.date}`,
        `Time: ${item.time}`,
        `Amount: ${item.amount > 0 ? "+" : "-"}${formatAmount(item.amount)}`,
        `Status: ${item.status}`,
        `Category: ${item.category}`,
        `Payment Method: ${item.method}`,
        `Invoice: ${item.invoice}`,
      ].join("\n"),
    );
    announce(`Downloaded ${item.invoice}.`);
  };

  const downloadStatement = () => {
    createDownload(
      "pawassist-wallet-statement.txt",
      [
        "PawAssist Wallet Statement",
        `Wallet Balance: Rs ${walletBalance.toLocaleString("en-IN")}`,
        `Reward Points: ${rewardPoints}`,
        "",
        ...transactions.map(
          (item) =>
            `${item.date} | ${item.title} | ${item.amount > 0 ? "+" : "-"}${formatAmount(item.amount)} | ${item.status} | ${item.invoice}`,
        ),
      ].join("\n"),
    );
    announce("Wallet statement downloaded.");
  };

  const handleAddMoney = () => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) {
      announce("Enter a valid amount to add money.");
      return;
    }

    setWalletBalance((current) => current + amount);
    setTransactions((current) => [
      {
        id: `txn-${current.length + 1}`,
        title: "Wallet Recharge",
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        amount,
        status: "Credited",
        category: "Top-up",
        method: "UPI",
        invoice: `TXN-2026-${9000 + current.length + 1}`,
      },
      ...current,
    ]);
    setIsAddMoneyOpen(false);
    announce(`Rs ${amount.toLocaleString("en-IN")} added to wallet.`);
  };

  const handleUseOffer = (offer) => {
    if (offer.kind === "cashback") {
      setWalletBalance((current) => current + offer.reward);
      setTransactions((current) => [
        {
          id: `txn-${current.length + 1}`,
          title: `${offer.title} Reward`,
          date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
          time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
          amount: offer.reward,
          status: "Credited",
          category: "Cashback",
          method: "Offer",
          invoice: `CB-${2026}${current.length + 1}`,
        },
        ...current,
      ]);
    }

    setOffers((current) => current.filter((item) => item.id !== offer.id));
    announce(`${offer.title} applied.`);
  };

  const handleRedeemRewards = () => {
    if (rewardPoints < 50) {
      announce("You need at least 50 points to redeem rewards.");
      return;
    }

    setRewardPoints((current) => current - 50);
    setWalletBalance((current) => current + 125);
    setRewardHistory((current) => [
      { id: `reward-${current.length + 1}`, title: "Redeemed for Wallet Credit", date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }), points: -50, type: "debit" },
      ...current,
    ]);
    setTransactions((current) => [
      {
        id: `txn-${current.length + 1}`,
        title: "Rewards Redemption Credit",
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        amount: 125,
        status: "Credited",
        category: "Rewards",
        method: "Wallet",
        invoice: `RWD-2026-${current.length + 1}`,
      },
      ...current,
    ]);
    announce("Rewards redeemed into wallet credit.");
  };

  const handleSetDefaultMethod = (methodId) => {
    setMethods((current) => current.map((item) => ({ ...item, defaultMethod: item.id === methodId })));
    const selected = methods.find((item) => item.id === methodId);
    announce(`${selected?.name || "Method"} set as default.`);
  };

  const quickSpendCards = [
    { label: "Total Spent", value: "Rs 6,145", tone: "teal" },
    { label: "Cashback Earned", value: "Rs 465", tone: "sage" },
    { label: "Avg Per Transaction", value: "Rs 768", tone: "brand" },
  ];

  return (
    <div className="wallet-hub-page">
      {statusMessage ? (
        <div className="wallet-hub-status-banner">
          <span>{statusMessage}</span>
          <button type="button" onClick={() => setStatusMessage("")} aria-label="Dismiss wallet status">
            <FiX />
          </button>
        </div>
      ) : null}

      <section className="wallet-hub-hero">
        <div>
          <span className="wallet-hub-kicker">PawAssist Wallet</span>
          <h1>My Wallet</h1>
          <p>Manage your payments, rewards, and transactions with a smoother PawAssist flow.</p>
        </div>
        <button type="button" className="wallet-hub-hero-action" onClick={() => setIsAddMoneyOpen(true)}>
          <FiPlus />
          Add Money
        </button>
      </section>

      <section className="wallet-hub-stats">
        <article className="wallet-hub-stat-card">
          <div className="wallet-hub-stat-icon teal"><FiCreditCard /></div>
          <div><span>Wallet Balance</span><strong>Rs {walletBalance.toLocaleString("en-IN")}</strong></div>
        </article>
        <article className="wallet-hub-stat-card">
          <div className="wallet-hub-stat-icon brand"><FiStar /></div>
          <div><span>Reward Points</span><strong>{rewardPoints}</strong></div>
        </article>
        <article className="wallet-hub-stat-card">
          <div className="wallet-hub-stat-icon sage"><FiArrowUpRight /></div>
          <div><span>Total Spent</span><strong>Rs {(totalSpent / 1000).toFixed(1)}K</strong></div>
        </article>
        <article className="wallet-hub-stat-card">
          <div className="wallet-hub-stat-icon clay"><FiGift /></div>
          <div><span>Total Savings</span><strong>Rs {(totalSavings / 1000).toFixed(1)}K</strong></div>
        </article>
      </section>

      <section className="wallet-hub-tabs">
              <button type="button" className={activeTab === "overview" ? "active" : ""} onClick={() => handleTabChange("overview")}>Overview</button>
              <button type="button" className={activeTab === "transactions" ? "active" : ""} onClick={() => handleTabChange("transactions")}>Transactions</button>
              <button type="button" className={activeTab === "rewards" ? "active" : ""} onClick={() => handleTabChange("rewards")}>Rewards & Offers</button>
      </section>

      {activeTab === "overview" ? (
        <div className="wallet-hub-grid">
          <div className="wallet-hub-main-column">
            <section className="wallet-hub-panel">
              <h2>Spending Analysis - This Month</h2>
              <div className="wallet-hub-mini-stats">
                {quickSpendCards.map((item) => (
                  <article key={item.label} className={`wallet-hub-mini-card ${item.tone}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>
              <div className="wallet-hub-spend-list">
                {spendBreakdown.map((item) => (
                  <div key={item.label} className="wallet-hub-spend-item">
                    <div className="wallet-hub-spend-row">
                      <span>{item.label}</span>
                      <strong>Rs {item.amount} ({item.percent}%)</strong>
                    </div>
                    <div className="wallet-hub-progress-track">
                      <div className={`wallet-hub-progress-fill ${item.tone}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="wallet-hub-panel">
              <div className="wallet-hub-panel-head">
                <h2>Recent Transactions</h2>
                <button type="button" onClick={() => setActiveTab("transactions")}>View All</button>
              </div>
              <div className="wallet-hub-transaction-list">
                {transactions.slice(0, 5).map((item) => (
                  <article key={item.id} className="wallet-hub-transaction-card compact">
                    <div className="wallet-hub-transaction-left">
                      <div className={`wallet-hub-transaction-icon ${item.amount > 0 ? "credit" : "debit"}`}>
                        {item.amount > 0 ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                      </div>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.date} • {item.time}</p>
                      </div>
                    </div>
                    <div className="wallet-hub-transaction-right">
                      <strong className={item.amount > 0 ? "credit" : "debit"}>{item.amount > 0 ? "+" : "-"}{formatAmount(item.amount)}</strong>
                      <span>{item.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="wallet-hub-side-column">
            <section className="wallet-hub-panel">
              <div className="wallet-hub-panel-head">
                <h2>Payment Methods</h2>
                <button type="button" onClick={handleAddMethod}>+ Add</button>
              </div>
              <div className="wallet-hub-method-list">
                {methods.map((method) => (
                  <article key={method.id} className="wallet-hub-method-card">
                    <div className="wallet-hub-method-left">
                      <div className="wallet-hub-method-icon"><FiCreditCard /></div>
                      <div>
                        <strong>{method.name}</strong>
                        <p>{method.detail}</p>
                      </div>
                    </div>
                    <button type="button" className={method.defaultMethod ? "default" : ""} onClick={() => handleSetDefaultMethod(method.id)}>
                      {method.defaultMethod ? "Default" : "Use Now"}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="wallet-hub-quick-card">
              <h2>Quick Actions</h2>
              <button type="button" onClick={() => setIsAddMoneyOpen(true)}><FiPlus />Add Money to Wallet</button>
              <button type="button" onClick={downloadStatement}><FiDownload />Download Statement</button>
              <button type="button" onClick={handleRedeemRewards}><FiGift />Redeem Rewards</button>
            </section>
          </div>
        </div>
      ) : null}

      {activeTab === "transactions" ? (
        <div className="wallet-hub-stack">
          <section className="wallet-hub-panel wallet-hub-search-panel">
            <div className="wallet-hub-search-box">
              <FiSearch />
              <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search transactions..." />
            </div>
            <button type="button" onClick={handleCycleFilter}>
              Filter: {transactionFilter === "all" ? "All" : transactionFilter === "debits" ? "Debits" : "Credits"}
            </button>
            <button type="button" onClick={handleCycleDateRange}>
              <FiCalendar />
              {dateRange === "all" ? "All Dates" : dateRange === "recent" ? "Recent" : "Earlier"}
            </button>
          </section>

          <section className="wallet-hub-panel">
            <h2>All Transactions</h2>
            <div className="wallet-hub-transaction-list">
              {filteredTransactions.map((item) => (
                <article key={item.id} className="wallet-hub-transaction-card full">
                  <div className="wallet-hub-transaction-left">
                    <div className={`wallet-hub-transaction-icon ${item.amount > 0 ? "credit" : "debit"}`}>
                      {item.amount > 0 ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.date} • {item.time}</p>
                      <small>Category: {item.category} • Payment: {item.method} • Invoice: {item.invoice}</small>
                    </div>
                  </div>
                  <div className="wallet-hub-transaction-right">
                    <strong className={item.amount > 0 ? "credit" : "debit"}>{item.amount > 0 ? "+" : "-"}{formatAmount(item.amount)}</strong>
                    <span>{item.status}</span>
                    <button type="button" onClick={() => downloadTransaction(item)}>Download</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "rewards" ? (
        <div className="wallet-hub-grid">
          <div className="wallet-hub-main-column">
            <section className="wallet-hub-panel">
              <h2>Active Offers & Deals</h2>
              <div className="wallet-hub-offer-grid">
                {offers.map((offer) => (
                  <article key={offer.id} className={`wallet-hub-offer-card ${offer.tone}`}>
                    <div className="wallet-hub-offer-top">
                      <div className="wallet-hub-offer-icon"><FiGift /></div>
                      <span>{offer.badge}</span>
                    </div>
                    <h3>{offer.title}</h3>
                    <p>{offer.detail}</p>
                    <footer>
                      <small>Valid till {offer.validTill}</small>
                      <button type="button" onClick={() => handleUseOffer(offer)}>Use Now</button>
                    </footer>
                  </article>
                ))}
              </div>
            </section>

            <section className="wallet-hub-panel">
              <h2>Rewards History</h2>
              <div className="wallet-hub-reward-list">
                {rewardHistory.map((item) => (
                  <article key={item.id} className="wallet-hub-reward-card">
                    <div className="wallet-hub-reward-left">
                      <div className={`wallet-hub-reward-icon ${item.type}`}><FiStar /></div>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.date}</p>
                      </div>
                    </div>
                    <strong className={item.type === "credit" ? "credit" : "debit"}>
                      {item.points > 0 ? "+" : ""}{item.points} pts
                    </strong>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="wallet-hub-side-column">
            <section className="wallet-hub-points-card">
              <div className="wallet-hub-points-icon"><FiStar /></div>
              <span>Your Reward Points</span>
              <strong>{rewardPoints}</strong>
              <p>≈ Rs {Math.round(rewardPoints * 1.25)} cashback value</p>
              <button type="button" onClick={handleRedeemRewards}>Redeem Now</button>
            </section>

            <section className="wallet-hub-panel">
              <h2>How to Earn More?</h2>
              <div className="wallet-hub-earn-list">
                <div><span>Book Services</span><strong>10-50 pts</strong></div>
                <div><span>Refer Friends</span><strong>100 pts</strong></div>
                <div><span>Complete Profile</span><strong>50 pts</strong></div>
                <div><span>Write Reviews</span><strong>25 pts</strong></div>
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {isAddMoneyOpen ? (
        <div className="wallet-hub-modal-overlay" role="presentation" onClick={() => setIsAddMoneyOpen(false)}>
          <div className="wallet-hub-modal-card" role="dialog" aria-modal="true" aria-label="Add money to wallet" onClick={(event) => event.stopPropagation()}>
            <div className="wallet-hub-modal-head">
              <h2>Add Money to Wallet</h2>
              <button type="button" onClick={() => setIsAddMoneyOpen(false)} aria-label="Close add money modal"><FiX /></button>
            </div>
            <label className="wallet-hub-modal-field">
              <span>Enter Amount</span>
              <input value={addAmount} onChange={(event) => setAddAmount(event.target.value)} placeholder="500" />
            </label>
            <div className="wallet-hub-amount-row">
              {["500", "1000", "2000"].map((value) => (
                <button key={value} type="button" onClick={() => setAddAmount(value)}>Rs {value}</button>
              ))}
            </div>
            <div className="wallet-hub-modal-actions">
              <button type="button" className="secondary" onClick={() => setIsAddMoneyOpen(false)}>Cancel</button>
              <button type="button" className="primary" onClick={handleAddMoney}>Add Money</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
