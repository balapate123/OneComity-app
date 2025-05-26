require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const crypto = require('crypto');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🌱 MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection failed", err));

// Use the hashed password for all dummy users ("password123")
const hashedPassword = "$2b$10$O4YzLgk3tN6SnKvzEv6geuzwZm7dcRJMWb5dBpdyM/2xGZcZed/1S";

const baseLat = 43.7717153;
const baseLng = -79.3449084;

// Helper to generate random Reddit-style username
function generateUsername() {
    const adjectives = ['happy','bouncy','clever','witty','brave','kind','lucky','fancy','silly','bright'];
    const animals = ['fox','panda','eagle','bear','koala','otter','whale','wolf','owl','lynx'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const randomStr = crypto.randomBytes(2).toString('hex'); // 4 hex
    return `comity_${adj}${animal}_${randomStr}`;
}

// Generate 10 users per activity
const activities = ["weed", "wine", "water"];
let dummyUsers = [];

activities.forEach((activity, activityIdx) => {
    for (let i = 0; i < 5; i++) {
        dummyUsers.push({
            email: `testuser_${activity}_${i + 1}@comity.com`,
            mobile: `+19050000${activityIdx}${i + 10}`,
            password: hashedPassword,
            username: generateUsername(),
            name: `Comity Tester ${activityIdx * 10 + i + 1}`,
            ageVerified: true,
            activity,
            location: {
                type: "Point",
                coordinates: [
                    // lng, lat randomized within ~0.01 deg of base
                    parseFloat((baseLng + (Math.random() - 0.5) * 0.01).toFixed(6)),
                    parseFloat((baseLat + (Math.random() - 0.5) * 0.01).toFixed(6)),
                ],
            },
            createdAt: new Date()
        });
    }
});

const seedUsers = async () => {
    try {
        await User.deleteMany({}); // Optional: clear existing users for a clean start
        await User.insertMany(dummyUsers);
        console.log("✅ Dummy users inserted near your coordinates for all activities!");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error inserting users", err);
        mongoose.connection.close();
    }
};

seedUsers();
