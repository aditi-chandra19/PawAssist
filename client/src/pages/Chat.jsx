import { useState } from "react";

const starterMessages = [
  { id: 1, side: "left", text: "Hello! I'm on my way to your location.", time: "2:45 PM" },
  { id: 2, side: "right", text: "Great! How long will it take?", time: "2:46 PM" },
  { id: 3, side: "left", text: "I'll be there in about 12 minutes.", time: "2:47 PM" },
  { id: 4, side: "right", text: "Perfect. Bruno is ready for his checkup!", time: "2:48 PM" },
  {
    id: 5,
    side: "left",
    text: "Wonderful! Please have his vaccination records ready if available.",
    time: "2:49 PM",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        side: "right",
        text: draft.trim(),
        time: "Just now",
      },
    ]);
    setDraft("");
  };

  return (
    <div className="care-page messages-page">
      <header className="page-hero violet">
        <div className="chat-hero-user">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80"
            alt="Dr. Sharma"
            className="chat-hero-avatar"
          />
          <div>
            <h1>Dr. Sharma</h1>
            <p>Online • Veterinarian</p>
          </div>
        </div>
        <div className="chat-call-pill">Call</div>
      </header>

      <section className="message-thread-card">
        <div className="message-thread">
          {messages.map((message) => (
            <div key={message.id} className={`message-row ${message.side}`}>
              <div className={`message-bubble ${message.side}`}>
                <p>{message.text}</p>
                <span>{message.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="message-composer">
          <button className="composer-tool">Photo</button>
          <button className="composer-tool">Report</button>
          <div className="composer-input-row">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your message..."
            />
            <button className="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

