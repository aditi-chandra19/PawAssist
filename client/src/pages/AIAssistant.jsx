import { useState } from "react";

const insights = [
  { title: "Bruno is 5 lbs overweight", detail: "Recommendation: Adjust diet plan", tone: "orange" },
  { title: "Low activity this week", detail: "Goal: 8,000 steps/day", tone: "blue" },
  { title: "Vaccination Due Soon", detail: "Rabies booster in 5 days", tone: "pink" },
];

const quickQuestions = [
  "What should I feed my labrador?",
  "Signs of illness in dogs",
  "Vaccination schedule",
  "Training tips for puppies",
];

const starter = [
  { side: "left", text: "Hello. I am your AI Pet Assistant. How can I help you and Bruno today?", meta: "Just now" },
  { side: "right", text: "Is it normal for my dog to eat grass?", meta: "2 mins ago" },
  {
    side: "left",
    text:
      "Yes, it is quite common for dogs to eat grass. It may help with an upset stomach, boredom, or natural grazing behavior. If it happens frequently with vomiting, book a vet visit.",
    meta: "2 mins ago",
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState(starter);
  const [draft, setDraft] = useState("");

  const sendPrompt = () => {
    if (!draft.trim()) {
      return;
    }

    const next = draft.trim();
    setMessages((current) => [
      ...current,
      { side: "right", text: next, meta: "Just now" },
      {
        side: "left",
        text: "I can help with symptoms, diet, activity, training, and vaccine reminders. If this feels urgent, schedule a vet visit from Bookings.",
        meta: "Just now",
      },
    ]);
    setDraft("");
  };

  return (
    <div className="care-page ai-page">
      <header className="page-hero hot">
        <div>
          <h1>AI Pet Assistant</h1>
          <p>Powered by PawAssist AI • Available 24/7</p>
        </div>
      </header>

      <section className="section-block">
        <p className="mini-label">Smart Insights for Bruno</p>
        <div className="feature-grid three">
          {insights.map((item) => (
            <article key={item.title} className="insight-mini-card">
              <div className={`feature-icon ${item.tone}`}>{item.title.slice(0, 1)}</div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-chat-card">
        <div className="ai-chat-thread">
          {messages.map((message, index) => (
            <div key={`${message.side}-${index}`} className={`message-row ${message.side}`}>
              <div className={`message-bubble ${message.side}`}>
                <p>{message.text}</p>
                <span>{message.meta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-question-grid">
          {quickQuestions.map((question) => (
            <button
              key={question}
              className="quick-question"
              onClick={() => setDraft(question)}
            >
              {question}
            </button>
          ))}
        </div>

        <div className="message-composer">
          <button className="composer-tool">Photo</button>
          <button className="composer-tool">Report</button>
          <div className="composer-input-row">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask me anything about pet care..."
            />
            <button className="send-button" onClick={sendPrompt}>
              Ask
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

