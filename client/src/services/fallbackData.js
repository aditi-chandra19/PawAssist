const services = [
  {
    id: "vet-visit",
    name: "Video Vet Consultation",
    description: "Connect with certified vets instantly via video call.",
    category: "core",
    price: 199,
    eta: "15 mins",
    accent: "#245c69",
  },
  {
    id: "ambulance",
    name: "Emergency Ambulance",
    description: "24/7 emergency pet ambulance with ICU facility.",
    category: "core",
    price: 499,
    eta: "Under 15 mins",
    accent: "#8a6f5a",
  },
  {
    id: "ai-health",
    name: "AI Health Assistant",
    description: "AI-powered pet care recommendations and insights.",
    category: "core",
    price: 0,
    eta: "Instant",
    accent: "#6f8092",
  },
  {
    id: "premium-vet-visit",
    name: "Premium Vet Visit",
    description: "Expert veterinary consultation at your doorstep.",
    category: "healthcare",
    price: 599,
    eta: "Home visit available",
    accent: "#366d79",
  },
  {
    id: "home-vaccination",
    name: "Home Vaccination",
    description: "Complete vaccination schedule at your home.",
    category: "healthcare",
    price: 349,
    eta: "All vaccines available",
    accent: "#4e7b71",
  },
  {
    id: "medicine-express",
    name: "Medicine Express",
    description: "Prescription medicines delivered super fast.",
    category: "healthcare",
    price: 99,
    eta: "30 min delivery",
    accent: "#64748b",
  },
  {
    id: "health-checkup",
    name: "Health Checkup",
    description: "Comprehensive health screening package.",
    category: "healthcare",
    price: 499,
    eta: "Complete profile",
    accent: "#8a6f5a",
  },
  {
    id: "cardiac-screening",
    name: "Cardiac Screening",
    description: "Advanced cardiac evaluation with ECG.",
    category: "healthcare",
    price: 799,
    eta: "Heart health monitoring",
    accent: "#7a6870",
  },
  {
    id: "luxury-grooming",
    name: "Luxury Grooming",
    description: "Professional grooming with spa treatment.",
    category: "wellness",
    price: 899,
    eta: "Premium spa included",
    accent: "#64748b",
  },
  {
    id: "spa-wellness",
    name: "Spa & Wellness",
    description: "Relaxing spa and wellness therapy session.",
    category: "wellness",
    price: 1299,
    eta: "Complete package",
    accent: "#8ea1b3",
  },
  {
    id: "custom-diet",
    name: "Custom Diet Plan",
    description: "Personalized nutrition and meal planning.",
    category: "wellness",
    price: 299,
    eta: "Nutritionist designed",
    accent: "#3d6d63",
  },
  {
    id: "fitness-training",
    name: "Fitness Training",
    description: "Exercise routines and fitness programs.",
    category: "wellness",
    price: 499,
    eta: "Stay active and healthy",
    accent: "#c19d7f",
  },
  {
    id: "training",
    name: "Behavioral Training",
    description: "Professional behavior modification training.",
    category: "wellness",
    price: 799,
    eta: "Expert trainers",
    accent: "#8b97a8",
  },
  {
    id: "pet-walking",
    name: "Pet Walking",
    description: "Professional dog walking service daily.",
    category: "daily-care",
    price: 199,
    eta: "Daily exercise routine",
    accent: "#245c69",
  },
  {
    id: "pet-sitting",
    name: "Pet Sitting",
    description: "Trusted pet care service at your home.",
    category: "daily-care",
    price: 399,
    eta: "While you're away",
    accent: "#8ea1b3",
  },
  {
    id: "pet-hotel",
    name: "Pet Hotel",
    description: "Luxury pet boarding with 24/7 monitoring.",
    category: "daily-care",
    price: 999,
    eta: "5-star boarding",
    accent: "#a28b94",
  },
  {
    id: "pet-taxi",
    name: "Pet Taxi",
    description: "Comfortable and safe pet transportation.",
    category: "special",
    price: 249,
    eta: "Safe transportation",
    accent: "#7ea9b0",
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
  {
    id: "provider-4",
    name: "Dr. Karan Sen",
    role: "Vaccination Specialist",
    rating: 4.8,
    distance: "1.9 km",
    eta: "25 mins",
    specialties: ["Home vaccination", "Preventive care", "Wellness plans"],
    languages: ["English", "Hindi", "Bengali"],
    nextSlot: "Today, 8:15 PM",
  },
  {
    id: "provider-5",
    name: "MediPaws Pharmacy",
    role: "Pharmacy Partner",
    rating: 4.6,
    distance: "0.9 km",
    eta: "30 mins",
    specialties: ["Prescription delivery", "OTC essentials"],
    languages: ["English", "Hindi"],
    nextSlot: "Available now",
  },
  {
    id: "provider-6",
    name: "Dr. Rhea Kapoor",
    role: "Cardiac Specialist",
    rating: 4.9,
    distance: "3.7 km",
    eta: "40 mins",
    specialties: ["ECG review", "Heart monitoring", "Specialist consult"],
    languages: ["English", "Hindi"],
    nextSlot: "Tomorrow, 12:30 PM",
  },
  {
    id: "provider-7",
    name: "Anya Nutrition Clinic",
    role: "Nutritionist",
    rating: 4.7,
    distance: "2.1 km",
    eta: "35 mins",
    specialties: ["Diet plans", "Weight management"],
    languages: ["English", "Hindi"],
    nextSlot: "Tomorrow, 4:00 PM",
  },
  {
    id: "provider-8",
    name: "Rohit Das",
    role: "Fitness Coach",
    rating: 4.6,
    distance: "2.8 km",
    eta: "38 mins",
    specialties: ["Mobility routines", "Strength play"],
    languages: ["English", "Hindi", "Bengali"],
    nextSlot: "Friday, 9:00 AM",
  },
  {
    id: "provider-9",
    name: "Maya Walkers Club",
    role: "Walker",
    rating: 4.5,
    distance: "1.1 km",
    eta: "18 mins",
    specialties: ["Daily walks", "Puppy exercise"],
    languages: ["English", "Hindi"],
    nextSlot: "Today, 6:45 PM",
  },
  {
    id: "provider-10",
    name: "HomeNest Pet Care",
    role: "Pet Sitter",
    rating: 4.7,
    distance: "2.6 km",
    eta: "30 mins",
    specialties: ["In-home sitting", "Overnight care"],
    languages: ["English", "Hindi"],
    nextSlot: "Tomorrow, 9:30 AM",
  },
  {
    id: "provider-11",
    name: "Royal Tails Boarding",
    role: "Boarding Partner",
    rating: 4.8,
    distance: "4.2 km",
    eta: "50 mins",
    specialties: ["Luxury boarding", "24/7 monitoring"],
    languages: ["English", "Hindi"],
    nextSlot: "Check-in today",
  },
  {
    id: "provider-12",
    name: "PawAssist Concierge",
    role: "Support Specialist",
    rating: 4.9,
    distance: "Remote",
    eta: "Instant",
    specialties: ["Urgent support", "Booking help"],
    languages: ["English", "Hindi"],
    nextSlot: "Available now",
  },
  {
    id: "provider-13",
    name: "ShieldSure Pets",
    role: "Insurance Advisor",
    rating: 4.7,
    distance: "Remote",
    eta: "15 mins",
    specialties: ["Claims support", "Coverage planning"],
    languages: ["English", "Hindi"],
    nextSlot: "Today, 7:00 PM",
  },
  {
    id: "provider-14",
    name: "City Paws Transport",
    role: "Transport Partner",
    rating: 4.7,
    distance: "1.6 km",
    eta: "22 mins",
    specialties: ["Safe transit", "Clinic drop-offs"],
    languages: ["English", "Hindi"],
    nextSlot: "Available now",
  },
  {
    id: "provider-15",
    name: "PawAssist Community Desk",
    role: "Community Coordinator",
    rating: 4.6,
    distance: "Remote",
    eta: "20 mins",
    specialties: ["Recovery alerts", "Community outreach"],
    languages: ["English", "Hindi"],
    nextSlot: "Available now",
  },
  {
    id: "provider-16",
    name: "Dr. Anita Desai",
    role: "Emergency Vet",
    rating: 5,
    distance: "1.8 km",
    eta: "15 mins",
    specialties: ["Cardiology", "Neurology", "Critical Care"],
    languages: ["English", "Hindi", "Gujarati"],
    nextSlot: "Available now",
  },
  {
    id: "provider-17",
    name: "Dr. Rajesh Mehta",
    role: "Emergency Vet",
    rating: 4.8,
    distance: "2.5 km",
    eta: "18 mins",
    specialties: ["Surgery", "Orthopedics", "Dental Care"],
    languages: ["English", "Hindi"],
    nextSlot: "Available now",
  },
  {
    id: "provider-18",
    name: "Dr. Kavya Nair",
    role: "Vaccination Specialist",
    rating: 4.9,
    distance: "1.4 km",
    eta: "14 mins",
    specialties: ["Vaccination", "Preventive Care", "Puppy Wellness"],
    languages: ["English", "Hindi", "Malayalam"],
    nextSlot: "Today, 8:00 PM",
  },
  {
    id: "provider-19",
    name: "Dr. Sameer Khanna",
    role: "Cardiac Specialist",
    rating: 4.9,
    distance: "2.2 km",
    eta: "20 mins",
    specialties: ["ECG Review", "Heart Monitoring", "Senior Pet Care"],
    languages: ["English", "Hindi"],
    nextSlot: "Today, 9:15 PM",
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

export const notifications = [
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
