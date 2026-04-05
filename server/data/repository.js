const { isDatabaseReady } = require("../config/db");
const memoryStore = require("./memoryStore");
const {
  services,
  providers,
  defaultPets,
  buildOverview,
} = require("./staticData");
const User = require("../models/User");
const Pet = require("../models/Pet");
const Booking = require("../models/Booking");

async function ensureUserPets(userId) {
  const existingPets = await Pet.find({ userId }).lean();

  if (existingPets.length > 0) {
    return existingPets;
  }

  const seededPets = defaultPets.map((pet, index) => ({
    userId,
    ...pet,
    petId: `${pet.petId}-${userId}-${index + 1}`,
  }));

  await Pet.insertMany(seededPets);
  return Pet.find({ userId }).lean();
}

async function loginUser(payload) {
  if (!isDatabaseReady()) {
    return memoryStore.loginUser(payload);
  }

  const normalizedPhone = String(payload.phone || "").trim();
  let user = await User.findOne({ phone: normalizedPhone });

  if (!user) {
    user = await User.create({
      userId: `user-${Date.now()}`,
      phone: normalizedPhone,
      name: payload.name?.trim() || "Pet Parent",
      city: "Kolkata",
      email: payload.email?.trim() || "care@pawassist.app",
      petName: payload.petName?.trim() || "",
      notes: payload.notes?.trim() || "Appointments, health reminders, and support updates",
    });
  } else if (payload.name?.trim() && user.name !== payload.name.trim()) {
    user.name = payload.name.trim();
    await user.save();
  }

  await ensureUserPets(user.userId);

  return {
    id: user.userId,
    name: user.name,
    phone: user.phone,
    city: user.city,
    email: user.email,
    petName: user.petName,
    notes: user.notes,
  };
}

async function getUserById(userId) {
  if (!isDatabaseReady()) {
    return memoryStore.getUserById(userId);
  }

  const user = await User.findOne({ userId }).lean();

  if (!user) {
    return null;
  }

  return {
    id: user.userId,
    name: user.name,
    phone: user.phone,
    city: user.city,
    email: user.email,
    petName: user.petName,
    notes: user.notes,
  };
}

async function updateUser(userId, patch) {
  if (!isDatabaseReady()) {
    return memoryStore.updateUser(userId, patch);
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return null;
  }

  const allowedFields = ["name", "phone", "city", "email", "petName", "notes"];
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(patch, field) && patch[field] !== undefined) {
      user[field] = typeof patch[field] === "string" ? patch[field].trim() : patch[field];
    }
  }

  await user.save();

  return {
    id: user.userId,
    name: user.name,
    phone: user.phone,
    city: user.city,
    email: user.email,
    petName: user.petName,
    notes: user.notes,
  };
}

async function getBookings(userId) {
  if (!isDatabaseReady()) {
    return memoryStore.getBookings(userId);
  }

  const query = userId ? { userId } : {};

  const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
  return bookings.map((booking) => ({
    id: booking.bookingId,
    userId: booking.userId,
    serviceId: booking.serviceId,
    providerId: booking.providerId,
    petId: booking.petId,
    date: booking.date,
    time: booking.time,
    note: booking.note,
    status: booking.status,
    createdAt: booking.createdAt,
  }));
}

async function createBooking(payload) {
  if (!isDatabaseReady()) {
    return memoryStore.createBooking(payload);
  }

  const booking = await Booking.create({
    bookingId: `booking-${Date.now()}`,
    status: "confirmed",
    ...payload,
  });

  return {
    id: booking.bookingId,
    userId: booking.userId,
    serviceId: booking.serviceId,
    providerId: booking.providerId,
    petId: booking.petId,
    date: booking.date,
    time: booking.time,
    note: booking.note,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

async function getOverview(userId) {
  if (!isDatabaseReady()) {
    return memoryStore.getOverview(userId);
  }

  const user = (await getUserById(userId)) || (await loginUser({ phone: "9999999999", name: "Aditi" }));
  const pets = await ensureUserPets(user.id);
  const bookings = await getBookings(user.id);

  const normalizedPets = pets.map((pet) => ({
    id: pet.petId || pet.id,
    name: pet.name,
    type: pet.type,
    age: pet.age,
    weight: pet.weight,
    mood: pet.mood,
    nextCare: pet.nextCare,
    diet: pet.diet,
  }));

  return buildOverview(user, normalizedPets, bookings);
}

module.exports = {
  services,
  providers,
  loginUser,
  updateUser,
  getUserById,
  getBookings,
  createBooking,
  getOverview,
};
