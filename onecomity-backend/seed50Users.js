require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🌱 MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection failed", err));

// Base location (Toronto Downtown)
const BASE_LONG = -79.3832;
const BASE_LAT = 43.6532;

const activities = ['weed', 'wine', 'water'];
const passwordHash = "$2b$10$O4YzLgk3tN6SnKvzEv6geuzwZm7dcRJMWb5dBpdyM/2xGZcZed/1S"; // "password123"

function getRandomCoords() {
  const latOffset = (Math.random() - 0.5) / 500;  // ~200m radius
  const lonOffset = (Math.random() - 0.5) / 500;
  return [BASE_LONG + lonOffset, BASE_LAT + latOffset];
}

function getRandomMobile(index) {
  return "+1" + (6000000000 + index); // e.g., +16000000001
}

const users = [];

for (let i = 1; i <= 50; i++) {
  const [lon, lat] = getRandomCoords();
  const activity = activities[Math.floor(Math.random() * activities.length)];

  users.push({
    email: `dummy${i}@onecomity.com`,
    mobile: getRandomMobile(i),
    password: passwordHash,
    ageVerified: true,
    activity,
    location: {
      type: "Point",
      coordinates: [lon, lat]
    }
  });
}

const seedUsers = async () => {
  try {
    await User.insertMany(users);
    console.log("✅ 50 dummy users inserted!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting dummy users", err);
    mongoose.connection.close();
  }
};

seedUsers();
