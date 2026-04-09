const { isDatabaseReady } = require("../config/db");
const memoryStore = require("./memoryStore");
const {
  services,
  providers,
  defaultPets,
  buildOverview,
} = require("./staticData");
const { createDefaultSettings, normalizeSettingsPayload } = require("./settingsDefaults");
const { hashPassword, verifyPassword, createId } = require("./security");
const User = require("../models/User");
const Pet = require("../models/Pet");
const Booking = require("../models/Booking");

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.userId || user.id,
    name: user.name,
    phone: user.phone,
    city: user.city,
    email: user.email,
    petName: user.petName,
    notes: user.notes,
    hasPassword: Boolean(user.passwordHash && user.passwordSalt),
  };
}

function ensureSettingsState(user) {
  let changed = false;

  if (!user.settings) {
    user.settings = createDefaultSettings();
    changed = true;
  } else {
    const normalized = normalizeSettingsPayload(user.settings);
    if (JSON.stringify(normalized) !== JSON.stringify(user.settings)) {
      user.settings = normalized;
      changed = true;
    }
  }

  return changed;
}

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

function normalizePetRecord(pet) {
  return {
    id: pet.petId || pet.id,
    petId: pet.petId || pet.id,
    userId: pet.userId,
    name: pet.name,
    type: pet.type,
    breed: pet.breed || pet.type,
    gender: pet.gender || "Male",
    age: pet.age,
    weight: pet.weight,
    color: pet.color || "",
    mood: pet.mood,
    nextCare: pet.nextCare,
    diet: pet.diet,
    medicalHistory: pet.medicalHistory || "",
    allergies: pet.allergies || "None",
    photo: pet.photo || "",
  };
}

async function loginUser(payload) {
  if (!isDatabaseReady()) {
    return memoryStore.loginUser(payload);
  }

  const normalizedPhone = String(payload.phone || "").trim();
  const normalizedName = payload.name?.trim();
  const normalizedCity = payload.city?.trim();
  const normalizedPetName = payload.petName?.trim();
  let user = await User.findOne({ phone: normalizedPhone });

  if (!user) {
    user = await User.create({
      userId: createId("user"),
      phone: normalizedPhone,
      name: normalizedName || "Pet Parent",
      city: normalizedCity || "Kolkata",
      email: payload.email?.trim() || "care@pawassist.app",
      petName: normalizedPetName || "",
      notes: payload.notes?.trim() || "Appointments, health reminders, and support updates",
      settings: createDefaultSettings(),
      passwordHash: "",
      passwordSalt: "",
    });
  } else {
    if (normalizedName && user.name !== normalizedName) {
      user.name = normalizedName;
    }

    if (normalizedCity && user.city !== normalizedCity) {
      user.city = normalizedCity;
    }

    if (normalizedPetName !== undefined && user.petName !== normalizedPetName) {
      user.petName = normalizedPetName;
    }
  }

  if (ensureSettingsState(user) || user.isModified()) {
    await user.save();
  }

  await ensureUserPets(user.userId);

  return toPublicUser(user);
}

async function getUserById(userId) {
  if (!isDatabaseReady()) {
    return memoryStore.getUserById(userId);
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return null;
  }

  if (ensureSettingsState(user)) {
    await user.save();
  }

  return toPublicUser(user);
}

async function updateUser(userId, patch) {
  if (!isDatabaseReady()) {
    return memoryStore.updateUser(userId, patch);
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return null;
  }

  ensureSettingsState(user);

  const allowedFields = ["name", "phone", "city", "email", "petName", "notes"];
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(patch, field) && patch[field] !== undefined) {
      user[field] = typeof patch[field] === "string" ? patch[field].trim() : patch[field];
    }
  }

  await user.save();

  return toPublicUser(user);
}

async function getUserSettings(userId) {
  if (!isDatabaseReady()) {
    return memoryStore.getUserSettings(userId);
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return null;
  }

  if (ensureSettingsState(user)) {
    await user.save();
  }

  return normalizeSettingsPayload(user.settings);
}

async function updateUserSettings(userId, patch) {
  if (!isDatabaseReady()) {
    return memoryStore.updateUserSettings(userId, patch);
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return null;
  }

  user.settings = normalizeSettingsPayload(patch);
  ensureSettingsState(user);
  await user.save();

  return normalizeSettingsPayload(user.settings);
}

async function changeUserPassword(userId, currentPassword, nextPassword) {
  if (!isDatabaseReady()) {
    return memoryStore.changeUserPassword(userId, currentPassword, nextPassword);
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return { ok: false, reason: "not_found" };
  }

  ensureSettingsState(user);

  if (
    user.passwordHash &&
    user.passwordSalt &&
    !verifyPassword(currentPassword, user.passwordHash, user.passwordSalt)
  ) {
    return { ok: false, reason: "invalid_current_password" };
  }

  const nextRecord = hashPassword(nextPassword);
  user.passwordHash = nextRecord.hash;
  user.passwordSalt = nextRecord.salt;
  await user.save();
  return { ok: true };
}

async function deleteUserAccount(userId) {
  if (!isDatabaseReady()) {
    return memoryStore.deleteUserAccount(userId);
  }

  const [userResult] = await Promise.all([
    User.deleteOne({ userId }),
    Pet.deleteMany({ userId }),
    Booking.deleteMany({ userId }),
  ]);

  return userResult.deletedCount > 0;
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

async function getPets(userId) {
  if (!isDatabaseReady()) {
    return memoryStore.getOverview(userId).pets.map(normalizePetRecord);
  }

  const pets = await ensureUserPets(userId);
  return pets.map(normalizePetRecord);
}

async function addPet(userId, payload) {
  if (!isDatabaseReady()) {
    return normalizePetRecord(memoryStore.addPet(userId, payload));
  }

  const pet = await Pet.create({
    userId,
    petId: createId("pet"),
    name: payload.name,
    type: payload.type,
    breed: payload.breed || payload.type,
    gender: payload.gender || "Male",
    age: payload.age,
    weight: payload.weight,
    color: payload.color || "",
    mood: payload.mood || "Happy",
    nextCare: payload.nextCare || "Wellness review coming up",
    diet: payload.diet || payload.dietaryNeeds || "",
    medicalHistory: payload.medicalHistory || "",
    allergies: payload.allergies || "None",
    photo: payload.photo || "",
  });

  return normalizePetRecord(pet.toObject());
}

async function updatePet(userId, petId, patch) {
  if (!isDatabaseReady()) {
    const updatedPet = memoryStore.updatePet(userId, petId, patch);
    return updatedPet ? normalizePetRecord(updatedPet) : null;
  }

  const pet = await Pet.findOne({ userId, petId });
  if (!pet) {
    return null;
  }

  const allowedFields = [
    "name",
    "type",
    "breed",
    "gender",
    "age",
    "weight",
    "color",
    "mood",
    "nextCare",
    "diet",
    "medicalHistory",
    "allergies",
    "photo",
  ];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(patch, field) && patch[field] !== undefined) {
      pet[field] = typeof patch[field] === "string" ? patch[field].trim() : patch[field];
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, "dietaryNeeds") && patch.dietaryNeeds !== undefined) {
    pet.diet = typeof patch.dietaryNeeds === "string" ? patch.dietaryNeeds.trim() : patch.dietaryNeeds;
  }

  await pet.save();
  return normalizePetRecord(pet.toObject());
}

async function deletePet(userId, petId) {
  if (!isDatabaseReady()) {
    return memoryStore.deletePet(userId, petId);
  }

  const result = await Pet.deleteOne({ userId, petId });
  return result.deletedCount > 0;
}

async function createBooking(payload) {
  if (!isDatabaseReady()) {
    return memoryStore.createBooking(payload);
  }

  const booking = await Booking.create({
    bookingId: createId("booking"),
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
    ...normalizePetRecord(pet),
  }));

  return buildOverview(user, normalizedPets, bookings);
}

module.exports = {
  services,
  providers,
  loginUser,
  updateUser,
  getUserSettings,
  updateUserSettings,
  changeUserPassword,
  deleteUserAccount,
  getPets,
  addPet,
  updatePet,
  deletePet,
  getUserById,
  getBookings,
  createBooking,
  getOverview,
};
