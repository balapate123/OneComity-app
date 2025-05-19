require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🌱 MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection failed", err));

// Password = "password123" hashed with bcrypt
const hashedPassword = "$2b$10$O4YzLgk3tN6SnKvzEv6geuzwZm7dcRJMWb5dBpdyM/2xGZcZed/1S";

const baseLat = 43.7681939;
const baseLng = -79.2206617;

const dummyUsers = Array.from({ length: 10 }, (_, i) => ({
  email: `testuser15${i + 15}@comity.com`,
  mobile: `+19568778${i + 10}`,
  password: hashedPassword,
  ageVerified: true,
  activity: "water",
  location: {
    type: "Point",
    coordinates: [
      parseFloat((baseLng + (Math.random() - 0.5) * 0.01).toFixed(2)), // lng
      parseFloat((baseLat + (Math.random() - 0.5) * 0.01).toFixed(2)), // lat
    ],
  },
}))

const seedUsers = async () => {
  try {
    await User.insertMany(dummyUsers);
    console.log("✅ Dummy users inserted near your coordinates");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting users", err);
    mongoose.connection.close();
  }
};

seedUsers();
