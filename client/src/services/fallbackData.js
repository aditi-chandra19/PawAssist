const services = [
  {
    id: "vet-visit",
    name: "Vet Visit",
    description: "Fast triage, diagnosis support, and at-home guidance.",
    category: "Health",
    price: 699,
    eta: "15 mins",
    accent: "#f97316",
  },
  {
    id: "grooming",
    name: "Grooming Session",
    description: "Gentle bathing, de-shedding, trimming, and drying.",
    category: "Care",
    price: 899,
    eta: "35 mins",
    accent: "#0f766e",
  },
  {
    id: "training",
    name: "Trainer Visit",
    description: "Routine and behavior sessions tailored to your pet.",
    category: "Training",
    price: 1099,
    eta: "45 mins",
    accent: "#1d4ed8",
  },
  {
    id: "ambulance",
    name: "Pet Ambulance",
    description: "Immediate transport for urgent care cases.",
    category: "Emergency",
    price: 1499,
    eta: "10 mins",
    accent: "#dc2626",
  },
];

const providers = [
  {
    id: "provider-1",
    name: "Dr. Priya Sharma",
    role: "Emergency Vet",
    rating: 4.9,
    distance: "1.2 km",
    eta: "12 mins",
    specialties: ["General diagnostics", "Emergency care"],
    languages: ["English", "Hindi"],
    nextSlot: "Today, 7:30 PM",
  },
  {
    id: "provider-2",
    name: "Arjun Mehta",
    role: "Certified Groomer",
    rating: 4.8,
    distance: "2.4 km",
    eta: "28 mins",
    specialties: ["Sensitive skin care", "Coat styling"],
    languages: ["English", "Hindi"],
    nextSlot: "Tomorrow, 10:00 AM",
  },
  {
    id: "provider-3",
    name: "Naina Kapoor",
    role: "Canine Trainer",
    rating: 4.7,
    distance: "3.1 km",
    eta: "42 mins",
    specialties: ["Recall", "Puppy routines"],
    languages: ["English", "Hindi"],
    nextSlot: "Tomorrow, 5:30 PM",
  },
];

const pets = [
  {
    id: "pet-1",
    name: "Bruno",
    type: "Golden Retriever",
    age: "4 years",
    weight: "31 kg",
    mood: "Energetic",
    nextCare: "Vaccination due in 6 days",
    diet: "Chicken, pumpkin, probiotic topper",
  },
  {
    id: "pet-2",
    name: "Misty",
    type: "Indie Cat",
    age: "2 years",
    weight: "4.6 kg",
    mood: "Calm",
    nextCare: "Grooming reminder on Friday",
    diet: "Salmon kibble, wet food at night",
  },
];

const notifications = [
  {
    id: "notif-1",
    title: "Bruno's medication reminder",
    detail: "Joint support chew due in 30 minutes.",
    priority: "high",
    time: "Today, 6:00 PM",
  },
  {
    id: "notif-2",
    title: "Provider accepted your booking",
    detail: "Dr. Priya confirmed tomorrow's home visit.",
    priority: "medium",
    time: "Today, 3:20 PM",
  },
  {
    id: "notif-3",
    title: "Wallet cashback unlocked",
    detail: "You earned Rs 180 after your last grooming session.",
    priority: "low",
    time: "Yesterday",
  },
];

const healthInsights = [
  {
    id: "health-1",
    title: "Weight trend stable",
    value: "31 kg",
    detail: "No meaningful change in the last 30 days.",
  },
  {
    id: "health-2",
    title: "Hydration watch",
    value: "Moderate",
    detail: "Encourage an extra 250 ml after evening walks this week.",
  },
  {
    id: "health-3",
    title: "Vaccination status",
    value: "1 dose due",
    detail: "Annual booster due on April 11.",
  },
];

const wallet = {
  balance: 2480,
  rewardPoints: 1180,
  monthlySpend: 3260,
  transactions: [
    { id: "txn-1", title: "Grooming session", amount: -899, time: "Apr 3" },
    { id: "txn-2", title: "Cashback reward", amount: 180, time: "Apr 3" },
    { id: "txn-3", title: "Wallet top-up", amount: 2000, time: "Apr 1" },
  ],
};

const chatThreads = [
  {
    id: "chat-1",
    name: "Dr. Priya",
    lastMessage: "Share a photo of Bruno's paw if the swelling returns.",
    unread: 2,
  },
  {
    id: "chat-2",
    name: "Grooming Desk",
    lastMessage: "Misty's hypoallergenic shampoo is back in stock.",
    unread: 0,
  },
];

const communityPosts = [
  {
    id: "post-1",
    author: "Sana and Coco",
    title: "Best monsoon paw care tips?",
    summary: "Looking for easy routines after muddy evening walks.",
    reactions: 28,
  },
  {
    id: "post-2",
    author: "Raghav",
    title: "Emergency vet bag checklist",
    summary: "I made a quick list after a midnight clinic run and it helped a lot.",
    reactions: 41,
  },
];

const insurancePlans = [
  {
    id: "plan-1",
    name: "PawShield Essential",
    premium: 499,
    coverage: "Up to Rs 80,000 yearly",
    highlight: "Accidents and emergency transport included",
  },
  {
    id: "plan-2",
    name: "PawShield Plus",
    premium: 899,
    coverage: "Up to Rs 2,00,000 yearly",
    highlight: "Covers surgeries, diagnostics, and chronic support",
  },
];

const premium = {
  price: 1499,
  features: [
    "Free priority chat with partner vets",
    "10% lower emergency dispatch fees",
    "Monthly wellness summary for every pet",
    "Double rewards on grooming and pharmacy orders",
  ],
};

const aiAssistant = [
  {
    id: "ai-1",
    title: "Loose stool guidance",
    response: "Keep meals bland tonight, monitor hydration, and escalate if vomiting starts.",
  },
  {
    id: "ai-2",
    title: "Grooming frequency",
    response: "Bruno's coat would likely do well with a full groom every 5 to 6 weeks.",
  },
];

const groomingPackages = [
  {
    id: "groom-1",
    name: "Fresh Coat",
    duration: "45 min",
    price: 799,
    includes: "Bath, blow dry, ear clean",
  },
  {
    id: "groom-2",
    name: "Spa Reset",
    duration: "75 min",
    price: 1299,
    includes: "Bath, trim, de-shed, paw balm",
  },
];

const careTimeline = [
  {
    id: "timeline-1",
    label: "Booking requested",
    description: "Emergency vet consult booked from the dashboard.",
    state: "done",
  },
  {
    id: "timeline-2",
    label: "Provider on route",
    description: "ETA updates will appear here once the provider starts travel.",
    state: "active",
  },
  {
    id: "timeline-3",
    label: "Care summary shared",
    description: "Prescription notes and invoices are stored after the visit.",
    state: "upcoming",
  },
];

const baseBookings = [
  {
    id: "booking-1",
    userId: "demo-user",
    serviceId: "vet-visit",
    providerId: "provider-1",
    petId: "pet-1",
    date: new Date(Date.now() + 86400000).toISOString(),
    time: "7:30 PM",
    status: "confirmed",
    note: "Mild limping after park run",
  },
];

const storageKey = "pawassist.local.bookings";

export const getLocalBookings = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
};

export const persistLocalBooking = (booking) => {
  if (typeof window === "undefined") {
    return booking;
  }

  const bookings = [booking, ...getLocalBookings()];
  window.localStorage.setItem(storageKey, JSON.stringify(bookings));
  return booking;
};

export const buildFallbackOverview = (user = null) => {
  const currentUser = user || {
    id: "demo-user",
    name: "Aditi",
    phone: "9999999999",
    city: "Kolkata",
  };

  const bookings = [...getLocalBookings(), ...baseBookings].filter(
    (booking, index, allBookings) =>
      allBookings.findIndex((entry) => entry.id === booking.id) === index,
  );

  return {
    user: currentUser,
    pets,
    services,
    providers,
    bookings,
    notifications,
    careTimeline,
    healthInsights,
    wallet,
    chatThreads,
    communityPosts,
    insurancePlans,
    premium,
    aiAssistant,
    groomingPackages,
    stats: {
      activeBookings: bookings.filter((booking) => booking.status !== "completed").length,
      rewardPoints: wallet.rewardPoints,
      healthyPets: pets.length,
      unreadMessages: chatThreads.reduce((sum, thread) => sum + thread.unread, 0),
    },
  };
};

export const createFallbackBooking = (payload) => ({
  id: `local-booking-${Date.now()}`,
  status: "confirmed",
  createdAt: new Date().toISOString(),
  ...payload,
});
