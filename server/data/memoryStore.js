const {
  services,
  providers,
  defaultPets,
  baseBookings,
  buildOverview,
} = require("./staticData");
const { createDefaultSettings, normalizeSettingsPayload } = require("./settingsDefaults");
const { hashPassword, verifyPassword, createId } = require("./security");

let users = [
  {
    id: "demo-user",
    name: "Aditi",
    phone: "9999999999",
    city: "Kolkata",
    email: "care@pawassist.app",
    petName: "Bruno",
    notes: "Appointments, health reminders, and support updates",
    settings: createDefaultSettings(),
    passwordHash: "",
    passwordSalt: "",
  },
];

const petsByUser = {
  "demo-user": defaultPets.map((pet) => ({ ...pet, id: pet.petId })),
};

let bookings = [...baseBookings];

function getUserById(userId) {
  return users.find((entry) => entry.id === userId) || users[0];
}

function getUserPets(userId) {
  if (!petsByUser[userId]) {
    petsByUser[userId] = defaultPets.map((pet, index) => ({
      ...pet,
      id: `${pet.petId}-${userId}-${index + 1}`,
      userId,
    }));
  }

  return petsByUser[userId];
}

function addPet(userId, payload) {
  const petId = createId("pet");
  const nextPet = {
    id: petId,
    petId,
    userId,
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
  };

  const pets = getUserPets(userId);
  petsByUser[userId] = [nextPet, ...pets];
  return nextPet;
}

function updatePet(userId, petId, patch) {
  const pets = getUserPets(userId);
  const index = pets.findIndex((pet) => pet.petId === petId || pet.id === petId);

  if (index === -1) {
    return null;
  }

  pets[index] = {
    ...pets[index],
    ...patch,
    diet: patch.diet || patch.dietaryNeeds || pets[index].diet,
  };

  return pets[index];
}

function deletePet(userId, petId) {
  const pets = getUserPets(userId);
  const nextPets = pets.filter((pet) => pet.petId !== petId && pet.id !== petId);

  if (nextPets.length === pets.length) {
    return false;
  }

  petsByUser[userId] = nextPets;
  return true;
}

function loginUser({ phone, name }) {
  const normalizedPhone = String(phone || "").trim();
  let user = users.find((entry) => entry.phone === normalizedPhone);

  if (!user) {
    user = {
      id: createId("user"),
      name: name?.trim() || "Pet Parent",
      phone: normalizedPhone,
      city: "Kolkata",
      email: "care@pawassist.app",
      petName: "",
      notes: "Appointments, health reminders, and support updates",
      settings: createDefaultSettings(),
      passwordHash: "",
      passwordSalt: "",
    };
    users.push(user);
    getUserPets(user.id);
  }

  if (!user.settings) {
    user.settings = createDefaultSettings();
  }

  return user;
}

function updateUser(userId, patch) {
  const index = users.findIndex((entry) => entry.id === userId);

  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...patch,
  };

  return users[index];
}

function getUserSettings(userId) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  user.settings = normalizeSettingsPayload(user.settings);
  return user.settings;
}

function updateUserSettings(userId, patch) {
  const index = users.findIndex((entry) => entry.id === userId);

  if (index === -1) {
    return null;
  }

  users[index].settings = normalizeSettingsPayload(patch);
  return users[index].settings;
}

function changeUserPassword(userId, currentPassword, nextPassword) {
  const index = users.findIndex((entry) => entry.id === userId);

  if (index === -1) {
    return { ok: false, reason: "not_found" };
  }

  if (
    users[index].passwordHash &&
    users[index].passwordSalt &&
    !verifyPassword(currentPassword, users[index].passwordHash, users[index].passwordSalt)
  ) {
    return { ok: false, reason: "invalid_current_password" };
  }

  const nextRecord = hashPassword(nextPassword);
  users[index].passwordHash = nextRecord.hash;
  users[index].passwordSalt = nextRecord.salt;
  return { ok: true };
}

function deleteUserAccount(userId) {
  const nextUsers = users.filter((entry) => entry.id !== userId);

  if (nextUsers.length === users.length) {
    return false;
  }

  users = nextUsers;
  delete petsByUser[userId];
  bookings = bookings.filter((booking) => booking.userId !== userId);
  return true;
}

function createBooking(payload) {
  const booking = {
    id: createId("booking"),
    status: "confirmed",
    createdAt: new Date().toISOString(),
    ...payload,
  };

  bookings = [booking, ...bookings];
  return booking;
}

function getBookings(userId) {
  return userId ? bookings.filter((booking) => booking.userId === userId) : bookings;
}

function getOverview(userId) {
  const user = getUserById(userId);
  return buildOverview(user, getUserPets(user.id), getBookings(user.id));
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
  addPet,
  updatePet,
  deletePet,
  getBookings,
  createBooking,
  getOverview,
  getUserById,
};
