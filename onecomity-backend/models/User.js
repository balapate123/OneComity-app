// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     mobile: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     username: { type: String, required: true, unique: true },    // <-- unique Reddit-style username
//     name: { type: String, required: true },                      // <-- display name
//     ageVerified: { type: Boolean, default: false },
//     activity: { type: String, enum: ['weed', 'wine', 'water'], default: 'weed' },
//     location: {
//         type: { type: String, default: "Point" },
//         coordinates: { type: [Number], default: [0, 0] }
//     },
//     createdAt: { type: Date, default: Date.now }
// });

// userSchema.index({ location: "2dsphere" });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ageVerified: { type: Boolean, default: false },
    activity: { type: String, enum: ['weed', 'wine', 'water'], default: 'weed' },
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }
    },
    createdAt: { type: Date, default: Date.now },
    hiddenChatPartners: [{ // <<--- Add this line
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', userSchema);
