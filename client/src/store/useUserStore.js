import { create } from "zustand";

const storageKey = "pawassist.user";

const getInitialUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "null");
  } catch {
    return null;
  }
};

const useUserStore = create((set) => ({
  user: getInitialUser(),
  setUser: (data) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(data));
    }
    set({ user: data });
  },
  updateUser: (patch) =>
    set((state) => {
      const nextUser = { ...(state.user || {}), ...patch };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
      }
      return { user: nextUser };
    }),
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
    set({ user: null });
  },
}));

export default useUserStore;
