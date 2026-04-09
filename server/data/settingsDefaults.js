function createDefaultSettings() {
  return {
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
      { id: "pm-1", label: "Visa", detail: ".... 4532 | Exp: 12/26", type: "Card", defaultMethod: true },
      { id: "pm-2", label: "Mastercard", detail: ".... 8765 | Exp: 08/27", type: "Card", defaultMethod: false },
      { id: "pm-3", label: "UPI", detail: "ayush@paytm", type: "UPI", defaultMethod: false },
    ],
    notifications: [
      {
        id: "notif-1",
        title: "Bruno's medication reminder",
        detail: "Joint support chew due in 30 minutes.",
        time: "Today, 6:00 PM",
        priority: "medium",
        read: false,
        archived: false,
      },
      {
        id: "notif-2",
        title: "Insurance claim update",
        detail: "Your recent claim was approved and is ready for payout.",
        time: "Today, 2:15 PM",
        priority: "high",
        read: true,
        archived: false,
      },
      {
        id: "notif-3",
        title: "Checkup follow-up",
        detail: "Bruno's annual wellness visit is coming up this week.",
        time: "Yesterday, 11:00 AM",
        priority: "low",
        read: true,
        archived: false,
      },
    ],
  };
}

function normalizeSettingsPayload(input = {}) {
  const defaults = createDefaultSettings();
  const next = {
    language: typeof input.language === "string" && input.language.trim() ? input.language.trim() : defaults.language,
    currency: typeof input.currency === "string" && input.currency.trim() ? input.currency.trim() : defaults.currency,
    themeMode: ["light", "dark", "auto"].includes(input.themeMode) ? input.themeMode : defaults.themeMode,
    notificationPrefs: {
      ...defaults.notificationPrefs,
      ...(input.notificationPrefs || {}),
    },
    privacy: {
      ...defaults.privacy,
      ...(input.privacy || {}),
    },
    paymentMethods: Array.isArray(input.paymentMethods) && input.paymentMethods.length
      ? input.paymentMethods.map((item, index) => ({
          id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `pm-${index + 1}`,
          label: typeof item.label === "string" ? item.label.trim() : "Payment Method",
          detail: typeof item.detail === "string" ? item.detail.trim() : "",
          type: typeof item.type === "string" ? item.type.trim() : "Card",
          defaultMethod: Boolean(item.defaultMethod),
        }))
      : defaults.paymentMethods,
    notifications: Array.isArray(input.notifications) && input.notifications.length
      ? input.notifications.map((item, index) => ({
          id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `notif-${index + 1}`,
          title: typeof item.title === "string" ? item.title.trim() : "Notification",
          detail: typeof item.detail === "string" ? item.detail.trim() : "",
          time: typeof item.time === "string" ? item.time.trim() : "Just now",
          priority: ["high", "medium", "low"].includes(item.priority) ? item.priority : "low",
          read: Boolean(item.read),
          archived: Boolean(item.archived),
        }))
      : defaults.notifications,
  };

  if (!next.paymentMethods.some((item) => item.defaultMethod) && next.paymentMethods.length) {
    next.paymentMethods = next.paymentMethods.map((item, index) => ({
      ...item,
      defaultMethod: index === 0,
    }));
  }

  return next;
}

module.exports = {
  createDefaultSettings,
  normalizeSettingsPayload,
};
