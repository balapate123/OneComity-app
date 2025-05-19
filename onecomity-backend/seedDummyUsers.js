require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🌱 MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB connection failed", err));

const dummyUsers = [
    {
        email: "weeduser1@comity.com",
        mobile: "+1111111111",
        password: "$2b$10$O4YzLgk3tN6SnKvzEv6geuzwZm7dcRJMWb5dBpdyM/2xGZcZed/1S", // "password123"
        ageVerified: true,
        activity: "weed",
        location: {
            type: "Point",
            coordinates: [-79.3832, 43.6532] // Downtown Toronto
        }
    },
    {
        email: "wineuser1@comity.com",
        mobile: "+1222222222",
        password: "$2b$10$O4YzLgk3tN6SnKvzEv6geuzwZm7dcRJMWb5dBpdyM/2xGZcZed/1S",
        ageVerified: true,
        activity: "wine",
        location: {
            type: "Point",
            coordinates: [-79.3805, 43.6550] // Nearby
        }
    },
    {
        email: "weeduser2@comity.com",
        mobile: "+1333333333",
        password: "$2b$10$O4YzLgk3tN6SnKvzEv6geuzwZm7dcRJMWb5dBpdyM/2xGZcZed/1S",
        ageVerified: true,
        activity: "weed",
        location: {
            type: "Point",
            coordinates: [-79.3849, 43.6517]
        }
    }
];

const seedUsers = async () => {
    try {
        await User.insertMany(dummyUsers);
        console.log("✅ Dummy users inserted");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error inserting users", err);
        mongoose.connection.close();
    }
};

seedUsers();
