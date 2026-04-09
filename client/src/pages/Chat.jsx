import { useEffect, useMemo, useRef, useState } from "react";
import useAppData from "../services/useAppData";

const storageKey = "pawassist.chat.threads";

const defaultThreads = [
  {
    id: "chat-1",
    name: "Dr. Priya Sharma",
    role: "Veterinarian",
    status: "Active now",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=220&q=80",
    accent: "teal",
    messages: [
      {
        id: "msg-1",
        side: "right",
        text: "Hi! I've booked an appointment for Bruno. When can you arrive?",
        time: "2:30 PM",
        delivered: true,
      },
      {
        id: "msg-2",
        side: "left",
        text: "Hello! I'll be there in about 15 minutes. Currently on my way!",
        time: "2:31 PM",
      },
      {
        id: "msg-3",
        side: "left",
        text: "Great! Please bring the vaccination records if you have them handy.",
        time: "2:31 PM",
      },
      {
        id: "msg-4",
        side: "right",
        text: "Sure, I have them ready. Should I prepare anything else?",
        time: "2:32 PM",
        delivered: true,
      },
      {
        id: "msg-5",
        side: "left",
        text: "Just make sure Bruno is comfortable. We'll take care of the rest!",
        time: "2:33 PM",
      },
    ],
  },
  {
    id: "chat-2",
    name: "Riya Kapoor",
    role: "Groomer",
    status: "Last seen 10 mins ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80",
    accent: "clay",
    messages: [
      {
        id: "msg-6",
        side: "left",
        text: "Luna's grooming session is scheduled for tomorrow morning.",
        time: "Yesterday",
      },
      {
        id: "msg-7",
        side: "left",
        text: "If you want, I can include a coat spa treatment too.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "chat-3",
    name: "Support Team",
    role: "Customer Support",
    status: "Usually replies in 2 mins",
    avatar: "",
    accent: "mist",
    messages: [
      {
        id: "msg-8",
        side: "left",
        text: "How can we help you today?",
        time: "Monday",
      },
    ],
  },
];

const formatTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

export default function Chat() {
  const { loading } = useAppData();
  const [threads, setThreads] = useState(() => {
    if (typeof window === "undefined") {
      return defaultThreads;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    return defaultThreads;
  });
  const [selectedThreadId, setSelectedThreadId] = useState(defaultThreads[0].id);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [actionNote, setActionNote] = useState("");
  const fileInputRef = useRef(null);
  const threadEndRef = useRef(null);
  const messageIdRef = useRef(1000);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [selectedThreadId, threads]);

  const visibleThreads = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return threads;
    }

    return threads.filter((thread) => {
      const lastMessage = thread.messages[thread.messages.length - 1]?.text || "";
      return (
        thread.name.toLowerCase().includes(term) ||
        thread.role.toLowerCase().includes(term) ||
        lastMessage.toLowerCase().includes(term)
      );
    });
  }, [query, threads]);

  const activeThread = visibleThreads.find((thread) => thread.id === selectedThreadId)
    || threads.find((thread) => thread.id === selectedThreadId)
    || threads[0];

  const upsertThread = (threadId, updater) => {
    setThreads((current) =>
      current.map((thread) => {
        if (thread.id !== threadId) {
          return thread;
        }

        return updater(thread);
      }),
    );
  };

  const createMessageId = (prefix) => {
    const nextId = `${prefix}-${messageIdRef.current}`;
    messageIdRef.current += 1;
    return nextId;
  };

  const pushSystemMessage = (text) => {
    if (!activeThread) {
      return;
    }

    upsertThread(activeThread.id, (thread) => ({
      ...thread,
      messages: [
        ...thread.messages,
        {
          id: createMessageId("sys"),
          side: "left",
          text,
          time: formatTime(),
        },
      ],
    }));
  };

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
    setActionNote("");
    upsertThread(threadId, (thread) => ({
      ...thread,
      unread: 0,
    }));
  };

  const handleSend = () => {
    if (!draft.trim() || !activeThread) {
      return;
    }

    const message = {
      id: createMessageId("msg"),
      side: "right",
      text: draft.trim(),
      time: formatTime(),
      delivered: true,
    };

    upsertThread(activeThread.id, (thread) => ({
      ...thread,
      messages: [...thread.messages, message],
    }));

    setDraft("");
    setActionNote("Message sent");
  };

  const handleAttachImage = (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeThread) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const message = {
      id: createMessageId("img"),
      side: "right",
      text: file.name,
      imageUrl,
      time: formatTime(),
      delivered: true,
    };

    upsertThread(activeThread.id, (thread) => ({
      ...thread,
      messages: [...thread.messages, message],
    }));

    setActionNote("Image attached and sent");
    event.target.value = "";
  };

  const handleCall = (mode) => {
    setActionNote(mode === "video" ? "Video call request sent" : "Calling provider...");
    pushSystemMessage(mode === "video" ? "Video consult request sent. Waiting for provider to join." : "Voice call request sent. Ringing provider now.");
  };

  const handleQuickAction = () => {
    setActionNote("Conversation details opened");
    pushSystemMessage("Conversation details opened. You can review provider info and care notes here.");
  };

  const handleEmoji = () => {
    setDraft((current) => `${current}${current ? " " : ""}🙂`);
  };

  if (loading) {
    return <div className="panel">Loading messages...</div>;
  }

  return (
    <div className="care-page messages-hub-page">
      <section className="messages-hub-shell">
        <aside className="messages-sidebar">
          <div className="messages-sidebar-head">
            <h1>Messages</h1>
            <p>Care conversations with your providers</p>
          </div>

          <label className="messages-search-shell">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations..."
            />
            <span>⌕</span>
          </label>

          <div className="messages-thread-list">
            {visibleThreads.map((thread) => {
              const lastMessage = thread.messages[thread.messages.length - 1];
              const isActive = thread.id === activeThread?.id;

              return (
                <button
                  key={thread.id}
                  type="button"
                  className={`messages-thread-item${isActive ? " active" : ""}`}
                  onClick={() => handleSelectThread(thread.id)}
                >
                  <div className={`messages-thread-avatar tone-${thread.accent}`}>
                    {thread.avatar ? <img src={thread.avatar} alt={thread.name} /> : <span>{thread.name.slice(0, 2).toUpperCase()}</span>}
                    <i />
                  </div>
                  <div className="messages-thread-copy">
                    <div className="messages-thread-row">
                      <strong>{thread.name}</strong>
                      <span>{lastMessage?.time || ""}</span>
                    </div>
                    <p>{thread.role}</p>
                    <div className="messages-thread-row">
                      <small>{lastMessage?.text || "Start a conversation"}</small>
                      {thread.unread ? <em>{thread.unread}</em> : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="messages-panel">
          <header className="messages-panel-head">
            <div className="messages-panel-user">
              <div className={`messages-thread-avatar tone-${activeThread?.accent || "teal"}`}>
                {activeThread?.avatar ? <img src={activeThread.avatar} alt={activeThread.name} /> : <span>{activeThread?.name?.slice(0, 2).toUpperCase()}</span>}
                <i />
              </div>
              <div>
                <h2>{activeThread?.name}</h2>
                <p>{activeThread?.status || activeThread?.role}</p>
              </div>
            </div>

            <div className="messages-panel-actions">
              <button type="button" className="messages-icon-button tone-teal" onClick={() => handleCall("voice")}>Call</button>
              <button type="button" className="messages-icon-button tone-berry" onClick={() => handleCall("video")}>Video</button>
              <button type="button" className="messages-icon-button tone-soft" onClick={handleQuickAction}>More</button>
            </div>
          </header>

          <div className="messages-thread-body">
            {activeThread?.messages.map((message) => (
              <div key={message.id} className={`messages-bubble-row ${message.side}`}>
                <div className={`messages-bubble ${message.side}`}>
                  {message.imageUrl ? (
                    <div className="messages-image-card">
                      <img src={message.imageUrl} alt={message.text || "attachment"} />
                    </div>
                  ) : null}
                  {message.text ? <p>{message.text}</p> : null}
                  <div className="messages-bubble-meta">
                    <span>{message.time}</span>
                    {message.delivered ? <em>Seen</em> : null}
                  </div>
                </div>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>

          <footer className="messages-composer-bar">
            {actionNote ? <p className="messages-action-note">{actionNote}</p> : null}

            <div className="messages-composer-row">
              <button type="button" className="messages-tool-button" onClick={() => fileInputRef.current?.click()}>
                Attach
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="messages-hidden-input"
                onChange={handleAttachImage}
              />

              <div className="messages-input-shell">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                />
                <button type="button" className="messages-emoji-button" onClick={handleEmoji}>
                  🙂
                </button>
              </div>

              <button type="button" className="messages-send-button" onClick={handleSend}>
                Send
              </button>
            </div>
          </footer>
        </section>
      </section>
    </div>
  );
}
