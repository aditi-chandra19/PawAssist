import { create } from "zustand";
import { notifications as fallbackNotifications } from "../services/fallbackData";
import { fetchSettings, savePassword, saveSettings } from "../services/settingsService";
import useUserStore from "./useUserStore";

const storageKey = "pawassist.settings";

const defaults = {
  accountPassword: "",
  language: "English",
  currency: "INR (Rs)",
  themeMode: "light",
  notificationPrefs: {
    bookingUpdates: true,
    serviceReminders: true,
    promotions: false,
    petHealthAlerts: true,
    communityUpdates: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  },
  privacy: {
    visibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false,
  },
  paymentMethods: [
    { id: "pm-1", label: "Visa", detail: "•••• 4532 • Exp: 12/26", type: "Card", defaultMethod: true },
    { id: "pm-2", label: "Mastercard", detail: "•••• 8765 • Exp: 08/27", type: "Card", defaultMethod: false },
    { id: "pm-3", label: "UPI", detail: "ayush@paytm", type: "UPI", defaultMethod: false },
  ],
  notifications: fallbackNotifications.map((item, index) => ({
    ...item,
    read: index > 0,
    archived: false,
  })),
};

const getInitialSettings = () => {
  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (!saved) {
      return defaults;
    }

    return {
      ...defaults,
      ...saved,
      notificationPrefs: { ...defaults.notificationPrefs, ...(saved.notificationPrefs || {}) },
      privacy: { ...defaults.privacy, ...(saved.privacy || {}) },
      paymentMethods: saved.paymentMethods?.length ? saved.paymentMethods : defaults.paymentMethods,
      notifications: saved.notifications?.length ? saved.notifications : defaults.notifications,
    };
  } catch {
    return defaults;
  }
};

const persistSettings = (state) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

const settingsSnapshot = (state) => ({
  language: state.language,
  currency: state.currency,
  themeMode: state.themeMode,
  notificationPrefs: state.notificationPrefs,
  privacy: state.privacy,
  paymentMethods: state.paymentMethods,
  notifications: state.notifications,
});

const persistAndReturn = (state, patch) => {
  const next = { ...state, ...patch };
  persistSettings(next);
  return next;
};

const syncSettings = async (snapshot) => {
  const user = useUserStore.getState().user;
  if (!user?.id) {
    return;
  }

  try {
    await saveSettings(snapshot);
  } catch (error) {
    console.error("Settings sync failed:", error);
  }
};

const useSettingsStore = create((set, get) => ({
  ...getInitialSettings(),
  replaceAllSettings: (snapshot) =>
    set((state) =>
      persistAndReturn(state, {
        ...defaults,
        ...snapshot,
        notificationPrefs: { ...defaults.notificationPrefs, ...(snapshot.notificationPrefs || {}) },
        privacy: { ...defaults.privacy, ...(snapshot.privacy || {}) },
        paymentMethods: snapshot.paymentMethods?.length ? snapshot.paymentMethods : defaults.paymentMethods,
        notifications: snapshot.notifications?.length ? snapshot.notifications : defaults.notifications,
      }),
    ),
  hydrateFromServer: async (userId) => {
    if (!userId) {
      return false;
    }

    try {
      const remote = await fetchSettings();
      get().replaceAllSettings(remote);
      return true;
    } catch (error) {
      console.error("Settings hydration failed:", error);
      return false;
    }
  },
  setThemeMode: (themeMode) =>
    set((state) => {
      const next = persistAndReturn(state, { themeMode });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  setLanguage: (language) =>
    set((state) => {
      const next = persistAndReturn(state, { language });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  setCurrency: (currency) =>
    set((state) => {
      const next = persistAndReturn(state, { currency });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  setNotificationPref: (key, value) =>
    set((state) => {
      const next = persistAndReturn(state, {
        notificationPrefs: {
          ...state.notificationPrefs,
          [key]: value,
        },
      });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  setPrivacy: (key, value) =>
    set((state) => {
      const next = persistAndReturn(state, {
        privacy: {
          ...state.privacy,
          [key]: value,
        },
      });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  addPaymentMethod: (method) =>
    set((state) => {
      const nextMethods = state.paymentMethods.some((item) => item.defaultMethod)
        ? [...state.paymentMethods, method]
        : [{ ...method, defaultMethod: true }, ...state.paymentMethods];
      const next = persistAndReturn(state, { paymentMethods: nextMethods });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  removePaymentMethod: (id) =>
    set((state) => {
      const current = state.paymentMethods.filter((item) => item.id !== id);
      const nextMethods = current.some((item) => item.defaultMethod)
        ? current
        : current.map((item, index) => ({ ...item, defaultMethod: index === 0 }));
      const next = persistAndReturn(state, { paymentMethods: nextMethods });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  setDefaultPaymentMethod: (id) =>
    set((state) => {
      const next = persistAndReturn(state, {
        paymentMethods: state.paymentMethods.map((item) => ({
          ...item,
          defaultMethod: item.id === id,
        })),
      });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  changePassword: async (currentPassword, nextPassword) => {
    const user = useUserStore.getState().user;

    if (user?.id) {
      try {
        await savePassword(currentPassword, nextPassword);
      } catch (error) {
        if (error?.response) {
          throw error;
        }
      }
    }

    set((state) => persistAndReturn(state, { accountPassword: nextPassword }));
    return true;
  },
  markNotificationRead: (id, read = true) =>
    set((state) => {
      const next = persistAndReturn(state, {
        notifications: state.notifications.map((item) => (item.id === id ? { ...item, read } : item)),
      });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  archiveNotification: (id) =>
    set((state) => {
      const next = persistAndReturn(state, {
        notifications: state.notifications.map((item) => (item.id === id ? { ...item, archived: true, read: true } : item)),
      });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  restoreNotification: (id) =>
    set((state) => {
      const next = persistAndReturn(state, {
        notifications: state.notifications.map((item) => (item.id === id ? { ...item, archived: false } : item)),
      });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  markAllNotificationsRead: () =>
    set((state) => {
      const next = persistAndReturn(state, {
        notifications: state.notifications.map((item) => ({ ...item, read: true })),
      });
      void syncSettings(settingsSnapshot(next));
      return next;
    }),
  resetSettings: () =>
    set(() => {
      persistSettings(defaults);
      return defaults;
    }),
  exportSettingsSnapshot: () => settingsSnapshot(get()),
}));

export default useSettingsStore;
