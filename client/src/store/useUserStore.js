import { create } from "zustand";

const storageKey = "pawassist.user";

const getInitialSession = () => {
  if (typeof window === "undefined") {
    return { user: null, token: "", expiresAt: "" };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");

    if (!parsed) {
      return { user: null, token: "", expiresAt: "" };
    }

    if (parsed.user || parsed.token || parsed.expiresAt) {
      return {
        user: parsed.user || null,
        token: parsed.token || "",
        expiresAt: parsed.expiresAt || "",
      };
    }

    return { user: parsed, token: "", expiresAt: "" };
  } catch {
    return { user: null, token: "", expiresAt: "" };
  }
};

const persistSession = (session) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  }
};

const initialSession = getInitialSession();

const useUserStore = create((set) => ({
  user: initialSession.user,
  token: initialSession.token,
  expiresAt: initialSession.expiresAt,
  setSession: (session) => {
    const nextSession = {
      user: session?.user || null,
      token: session?.token || "",
      expiresAt: session?.expiresAt || "",
    };

    persistSession(nextSession);
    set(nextSession);
  },
  setUser: (data) => {
    const nextSession = { user: data, token: "", expiresAt: "" };
    persistSession(nextSession);
    set(nextSession);
  },
  updateUser: (patch) =>
    set((state) => {
      const nextUser = { ...(state.user || {}), ...patch };
      const nextSession = {
        user: nextUser,
        token: state.token,
        expiresAt: state.expiresAt,
      };
      persistSession(nextSession);
      return nextSession;
    }),
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
    set({ user: null, token: "", expiresAt: "" });
  },
}));

export default useUserStore;
