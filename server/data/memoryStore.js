const {
  services,
  providers,
  defaultPets,
  baseBookings,
  buildOverview,
} = require("./staticData");

let users = [
  {
    id: "demo-user",
    name: "Aditi",
    phone: "9999999999",
    city: "Kolkata",
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

function loginUser({ phone, name }) {
  const normalizedPhone = String(phone || "").trim();
  let user = users.find((entry) => entry.phone === normalizedPhone);

  if (!user) {
    user = {
      id: `user-${users.length + 1}`,
      name: name?.trim() || "Pet Parent",
      phone: normalizedPhone,
      city: "Kolkata",
    };
    users.push(user);
    getUserPets(user.id);
  }

  return user;
}

function createBooking(payload) {
  const booking = {
    id: `booking-${bookings.length + 1}`,
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
  getBookings,
  createBooking,
  getOverview,
  getUserById,
};
