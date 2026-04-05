import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const insightCards = [
  { title: "Triage Confidence", detail: "Symptoms can be categorized quickly before booking care.", tone: "orange", value: "94%" },
  { title: "Health Context", detail: "Diet, activity, and recent behavior are summarized in one thread.", tone: "blue", value: "Live" },
  { title: "Escalation Ready", detail: "Urgent cases can move straight to emergency booking.", tone: "pink", value: "< 1 min" },
];

const quickQuestions = [
  "My dog is vomiting and not eating",
  "Build a healthy diet plan for my dog",
  "What vaccines are due this month?",
  "How should I prepare for a video vet consult?",
];

const starterConversation = [
  { side: "left", text: "Hello. I am your PawAssist clinical AI. Describe the symptom, urgency, age, and pet name, and I will guide the next best step.", meta: "Just now" },
  { side: "right", text: "My dog has low appetite since this morning.", meta: "2 mins ago" },
  { side: "left", text: "Low appetite can be routine or early illness. I would next check hydration, vomiting, stool, energy level, and whether anything new was eaten. If symptoms worsen, move directly into vet consult or emergency care.", meta: "2 mins ago" },
];

function buildAssistantReply(prompt, mode) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("vomit") || normalized.includes("emergency") || normalized.includes("bleeding")) {
    return "Assessment: urgent symptoms may be developing. Recommended next step: move to emergency booking if there is repeated vomiting, bleeding, collapse, breathing change, or refusal to drink. What to collect now: symptom start time, number of episodes, hydration, and recent food intake.";
  }

  if (mode === "nutrition" || normalized.includes("diet") || normalized.includes("feed")) {
    return "Assessment: this is best handled as a nutrition planning case. Recommended next step: share breed, age, weight, current food, and activity level so I can structure a practical meal plan. Escalate to consult if there is weight loss, vomiting, diarrhea, or allergies.";
  }

  if (normalized.includes("vaccine") || normalized.includes("schedule")) {
    return "Assessment: vaccination planning should be organized by age and last dose date. Recommended next step: tell me your pet's age and last vaccine date, and I will outline the likely due vaccines. If you want a confirmed care plan, open vet consult and mention vaccination scheduling.";
  }

  return "Assessment: I can help triage symptoms, explain likely care paths, and prepare you for the right service. Recommended next step: tell me symptom, duration, appetite, activity, and urgency. If care is needed now, I can route you to vet consult or emergency booking.";
}

export default function ProAIAssistant() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "triage";
  const [messages, setMessages] = useState(starterConversation);
  const [draft, setDraft] = useState("");

  const headerCopy = useMemo(() => {
    if (mode === "nutrition") {
      return {
        title: "AI Nutrition Assistant",
        subtitle: "Diet planning, feeding structure, and practical nutrition guidance.",
      };
    }

    return {
      title: "AI Clinical Assistant",
      subtitle: "Professional symptom triage, next-step guidance, and booking escalation.",
    };
  }, [mode]);

  const sendPrompt = () => {
    if (!draft.trim()) {
      return;
    }

    const prompt = draft.trim();
    const reply = buildAssistantReply(prompt, mode);
    setMessages((current) => [
      ...current,
      { side: "right", text: prompt, meta: "Just now" },
      { side: "left", text: reply, meta: "Just now" },
    ]);
    setDraft("");
  };

  return (
    <div className="care-page ai-page">
      <header className="page-hero hot">
        <div>
          <h1>{headerCopy.title}</h1>
          <p>{headerCopy.subtitle}</p>
        </div>
        <div className="section-actions">
          <button type="button" className="ghost-button" onClick={() => navigate("/app/booking?service=vet-visit&mode=consult")}>
            Vet Consult
          </button>
          <button type="button" className="primary-button" onClick={() => navigate("/app/booking?service=ambulance&mode=emergency")}>
            Emergency Help
          </button>
        </div>
      </header>

      <section className="section-block">
        <p className="mini-label">Professional AI Support</p>
        <div className="feature-grid three">
          {insightCards.map((item) => (
            <article key={item.title} className="insight-mini-card">
              <div className={`feature-icon ${item.tone}`}>{item.title.slice(0, 1)}</div>
              <span className="mini-label">{item.value}</span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-chat-card professional-ai-card">
        <div className="ai-assist-topbar">
          <div>
            <strong>{mode === "nutrition" ? "Nutrition Guidance Mode" : "Clinical Triage Mode"}</strong>
            <p>Responses are structured to help you choose the right next service fast.</p>
          </div>
          <span className="booking-sla-pill">{mode === "nutrition" ? "Diet planning" : "Symptom triage"}</span>
        </div>

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
            <button key={question} className="quick-question" onClick={() => setDraft(question)}>
              {question}
            </button>
          ))}
        </div>

        <div className="message-composer">
          <button className="composer-tool">Photo</button>
          <button className="composer-tool">Timeline</button>
          <div className="composer-input-row">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={mode === "nutrition" ? "Describe age, breed, weight, food, and diet issue..." : "Describe symptom, urgency, appetite, and duration..."}
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
