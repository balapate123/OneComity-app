const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Otp = require('../models/Otp');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper: Generate random, Reddit-style username

function generateUniqueUsername() {
    const adjectives = [
    "Cool", "Awesome", "Epic", "Sleek", "Sharp", "Funky", "Groovy", "Mystic",
    "Shadowy", "Silent", "Rapid", "Blazing", "Crimson", "Golden", "Silver",
    "Electric", "Cosmic", "Lunar", "Solar", "Neon", "Retro", "Vintage", "Modern",
    "Urban", "Wild", "Untamed", "Creative", "Vibrant", "Dynamic", "Zen",
    "Witty", "Quirky", "Bold", "Fearless", "Mighty", "Noble", "Royal",
    "Swift", "Nimble", "Jazzy", "Lively", "Playful", "Radiant", "Shining",
    "Stellar", "Mystical", "Enchanted", "Galactic", "Quantum", "Binary",
    "Abstract", "Surreal", "Fluid", "Frosty", "Fiery", "Oceanic", "Emerald",
    "Sapphire", "Amethyst", "Ruby", "Obsidian", "Crystal", "Velvet", "Iron",
    "Stone", "Wooden", "Metal", "Plastic", "Glass", "Paper", "Pixel", "Byte",
    "Code", "Logic", "Circuit", "Signal", "Fusion", "Infinity", "Zero",
    "Alpha", "Beta", "Gamma", "Delta", "Omega", "Unique", "Novel", "Rare",
    "Prime", "Elite", "Supreme", "Ultimate", "Legendary", "Mythic", "Heroic",
    "Valiant", "Grand", "Majestic", "Super", "Hyper", "Mega", "Ultra",
    "Turbo", "Power", "Force", "Strike", "Blitz", "Phantom", "Specter",
    "Dream", "Night", "Dawn", "Dusk", "Twilight", "Aurora", "Comet",
    "Meteor", "Nova", "Orbit", "Galaxy", "Universe", "Zenith", "Nadir",
    "Brilliant", "Dazzling", "Gleaming", "Luminous", "Sparkling", "Incandescent",
    "Resonant", "Sonorous", "Melodic", "Harmonious", "Rhythmic", "Euphonic",
    "Mystifying", "Bewitching", "Captivating", "Charming", "Elegant", "Graceful",
    "Serene", "Tranquil", "Peaceful", "Calm", "Gentle", "Soft", "Whispering",
    "Soothing", "Relaxed", "Focused", "Determined", "Tenacious", "Resilient",
    "Fearless", "Courageous", "Valiant", "Gallant", "Daring", "Adventurous",
    "Whimsical", "Fantastical", "Magical", "Otherworldly", "Ethereal", "Celestial",
    "Ancient", "Timeless", "Eternal", "Infinite", "Boundless", "Limitless",
    "Pristine", "Pure", "Clean", "Fresh", "Vivid", "Radiant", "Lively",
    "Energetic", "Zealous", "Passionate", "Fervent", "Ardent", "Dynamic",
    "Progressive", "Innovative", "Inventive", "Original", "Creative",
    "Thoughtful", "Wise", "Clever", "Ingenious", "Insightful", "Astute",
    "Keen", "Sharp-witted", "Resourceful", "Adaptable", "Versatile",
    "Strategic", "Tactical", "Calculated", "Precise", "Accurate", "Efficient",
    "Organized", "Systematic", "Logical", "Rational", "Analytical",
    "Empirical", "Experimental", "Theoretical", "Conceptual", "Abstract",
    "Tangible", "Concrete", "Solid", "Firm", "Stable", "Secure", "Reliable",
    "Trustworthy", "Dependable", "Consistent", "Constant", "Unwavering",
    "Steadfast", "Loyal", "Faithful", "Devoted", "Sincere", "Genuine",
    "Authentic", "Real", "True", "Valid", "Legitimate", "Official",
    "Canonical", "Standard", "Universal", "Global", "Cosmopolitan",
    "Local", "Regional", "National", "International", "Continental",
    "Interstellar", "Extraterrestrial", "Terrestrial", "Aquatic", "Aerial",
    "Subterranean", "Arctic", "Tropical", "Temperate", "Desert", "Forest",
    "Mountain", "Valley", "Plains", "Coastal", "Island", "Continental",
    "Domestic", "Feral", "Exotic", "Indigenous", "Native", "Migratory",
    "Nocturnal", "Diurnal", "Crepuscular", "Ephemeral", "Transient", "Fleeting",
    "Perennial", "Annual", "Seasonal", "Daily", "Weekly", "Monthly",
    "Yearly", "Decadal", "Centennial", "Millennial", "Primeval", "Ancient",
    "Medieval", "Renaissance", "Baroque", "Classical", "Romantic",
    "Victorian", "Edwardian", "Modern", "Contemporary", "Futuristic"
  ];

  const nouns = [
    "Ninja", "Samurai", "Pirate", "Wizard", "Sorcerer", "Dragon", "Phoenix",
    "Griffin", "Titan", "Hero", "Legend", "Knight", "Rider", "Warrior",
    "Hunter", "Scout", "Ghost", "Specter", "Phantom", "Shadow", "Blade",
    "Sword", "Shield", "Arrow", "Bolt", "Storm", "Thunder", "Lightning",
    "Fire", "Frost", "Ice", "Ocean", "Wave", "Tide", "Star", "Moon", "Sun",
    "Planet", "Comet", "Galaxy", "Universe", "Pixel", "Byte", "Code",
    "Logic", "Circuit", "Signal", "Fusion", "Atom", "Quark", "Neuron",
    "Vector", "Matrix", "System", "Kernel", "Driver", "Hacker", "Coder",
    "Geek", "Nerd", "Guru", "Master", "Sensei", "Yogi", "Wanderer",
    "Nomad", "Traveler", "Explorer", "Pioneer", "Visionary", "Creator",
    "Artist", "Muse", "Genius", "Prodigy", "Virtuoso", "Maestro", "Champion",
    "Ace", "Rookie", "Veteran", "Boss", "Chief", "Captain", "Colonel",
    "Major", "General", "President", "King", "Queen", "Prince", "Princess",
    "Earl", "Duke", "Baron", "Count", "Squire", "Lord", "Lady", "Empress",
    "Emperor", "Sultan", "Pharaoh", "Ruler", "Governor", "Mayor", "Senator",
    "Ambassador", "Envoy", "Diplomat", "Advocate", "Counselor", "Mentor",
    "Guide", "Guardian", "Sentinel", "Watcher", "Seeker", "Finder",
    "Inventor", "Innovator", "Designer", "Architect", "Engineer", "Scientist",
    "Philosopher", "Thinker", "Dreamer", "Believer", "Achiever", "Winner",
    "Loser", "Player", "Gambler", "Rogue", "Outlaw", "Rebel", "Maverick",
    "Daredevil", "Stuntman", "Jester", "Clown", "Mime", "Bard", "Poet",
    "Singer", "Dancer", "Musician", "Composer", "Conductor", "Orchestra",
    "Symphony", "Melody", "Harmony", "Rhythm", "Beat", "Tempo", "Cadence",
    "Vocal", "Instrument", "Lyric", "Chorus", "Verse", "Bridge", "Solo",
    "Eagle", "Falcon", "Hawk", "Raven", "Sparrow", "Robin", "Bluejay", "Finch",
    "Owl", "Stork", "Crane", "Swan", "Duck", "Goose", "Pelican", "Seagull",
    "Albatross", "Penguin", "Ostrich", "Emu", "Kiwi", "Dodo", "Archaeopteryx",
    "Mammoth", "Sabertooth", "Direwolf", "Unicorn", "Centaur", "Minotaur",
    "Sphinx", "Hydra", "Chimera", "Gorgon", "Cyclops", "Cerberus", "Kraken",
    "Leviathan", "Behemoth", "Jormungandr", "Fenrir", "Sleipnir", "Gungnir",
    "Mjolnir", "Aegis", "Excalibur", "Gram", "Durandal", "Joyous", "Curtana",
    "Tizona", "Colada", "Ascalon", "Arondight", "Galatine", "Fragarach",
    "Gáe Bulg", "Ruyi Jingu Bang", "Vajra", "Trishul", "Pashupata", "Brahmastra",
    "Vijaya", "Pinaka", "Sharanga", "Khanda", "Talwar", "Katana", "Nodachi",
    "Tanto", "Wakizashi", "Sai", "Tonfa", "Nunchaku", "Bo", "Shuriken",
    "Kunai", "Kama", "Tetsubo", "Kanabo", "Yari", "Naginata", "Bisento",
    "Glaive", "Halberd", "Pike", "Lance", "Javelin", "Dart", "Sling",
    "Bow", "Crossbow", "Catapult", "Trebuchet", "Ballista", "Cannon",
    "Musket", "Rifle", "Pistol", "Shotgun", "Revolver", "Grenade", "Bomb",
    "Missile", "Rocket", "Torpedo", "Mine", "Drone", "Satellite", "Telescope",
    "Microscope", "Algorithm", "Protocol", "Firewall", "Database", "Server",
    "Router", "Switch", "Network", "Internet", "Website", "Domain", "Cloud",
    "Bigdata", "Analytics", "Machine", "Learning", "Intelligence", "Quantum",
    "Nanobot", "Cyborg", "Android", "Robot", "Automaton", "Golem", "Sprite",
    "Fairy", "Elf", "Dwarf", "Gnome", "Ogre", "Troll", "Goblin", "Imp",
    "Pixie", "Leprechaun", "Banshee", "Selkie", "Kitsune", "Yokai", "Kami"
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNumber = Math.floor(Math.random() * 90) + 10; // Generate a 2-digit random number
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  const formats = [
    `${randomAdjective}${randomNoun}`,
    `${randomAdjective}${randomNoun}${randomNumber}`,
    `${randomAdjective}-${randomNoun}`,
    `${randomAdjective}-${randomNoun}-${randomNumber}`,
    `${randomAdjective}_${randomNoun}`,
    `${randomAdjective}_${randomNoun}_${randomNumber}`,
    `${randomNoun}${randomNumber}${randomAdjective}`,
    `${randomNoun}${randomAdjective}`
  ];

  const randomFormat = formats[Math.floor(Math.random() * formats.length)];
  return randomFormat;
  
}

// REGISTER USER
// exports.registerUser = async (req, res) => {
//     const { email, mobile, password, name } = req.body;

//     try {
//         if (!email || !mobile || !password || !name) {
//             return res.status(400).json({ msg: 'All fields are required.' });
//         }

//         let user = await User.findOne({ email });
//         if (user) return res.status(400).json({ msg: 'User already exists' });

//         // Ensure unique username (could add retry loop for >1M users)
//         let username;
//         let unique = false;
//         while (!unique) {
//             username = generateUniqueUsername();
//             const exists = await User.findOne({ username });
//             if (!exists) unique = true;
//         }

//         user = new User({ email, mobile, password, name, username });

//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         await user.save();

//         console.log('User Registered Successfully!');

//         // JWT Payload
//         const payload = { user: { id: user.id, username: user.username } };

//         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
//             if (err) throw err;
//             // Return username and name for frontend UI
//             res.json({ token, username: user.username, name: user.name });
//         });
//     } catch (err) {
//         console.error('Register error:', err.message);
//         res.status(500).send('Server error');
//     }
// };
exports.registerUser = async (req, res) => {
    const { email, mobile, password, name, activity  } = req.body;

     const finalActivity = activity || 'weed';

    try {
        if (!email || !mobile || !password || !name) {
            return res.status(400).json({ msg: 'All fields are required.' });
        }

        // Ensure email/mobile uniqueness
        let existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists with that email or mobile.' });
        }

        // Generate a unique username
        let username;
        let isUnique = false;
        while (!isUnique) {
            username = generateUniqueUsername();
            const userCheck = await User.findOne({ username });
            if (!userCheck) isUnique = true;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            mobile,
            password: hashedPassword,
            activity: finalActivity,
            name,
            username // generated unique username!
        });

        await user.save();

        console.log('User Registered Successfully!');
        console.log('Registering/Logging in user:', user._id, user.id);

        const payload = { user: { id: user.id, username: user.username } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, username: user.username, name: user.name });
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).send('Server error');
    }
};


// LOGIN USER (Email & Password)
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

        const payload = { user: { id: user.id, username: user.username } };

        console.log('Logging User Success');
        console.log('Registering/Logging in user:', user._id, user.id);

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            // ADD userId to response!
            res.json({
                token,
                userId: user.id,              // <-- Add this line!
                username: user.username,
                name: user.name
            });
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server error');
    }
};


// SEND OTP
exports.sendOtp = async (req, res) => {
    const { mobile } = req.body;

    console.log('Sending OTP');
    const client = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({ mobile, otp: otpCode });

        await client.messages.create({
            body: `Your OneComity OTP code is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobile
        });

        res.json({ msg: 'OTP sent successfully.' });
    } catch (error) {
        console.error(error.message);
        console.log('Send OTP Error');
        res.status(500).send('Error sending OTP.');
    }
};


// exports.sendOtp = async (req, res) => {
//     const { mobile } = req.body;
//     if (!mobile) {
//         return res.status(400).json({ msg: 'Mobile number is required.' });
//     }
//     try {
//         const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//         await Otp.create({ mobile, otp: otpCode });
//         console.log(`[OneComity] OTP ${otpCode} created for ${mobile}`);
//         // Twilio line removed
//         res.json({ msg: 'OTP sent successfully.' });
//     } catch (error) {
//         console.error('[OneComity] Send OTP Error:', error.message);
//         res.status(500).send('Error sending OTP.');
//     }
// };

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;
    console.log('Verifying OTP');

    try {
        const otpRecord = await Otp.findOne({ mobile, otp });

        if (!otpRecord) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }

        await User.updateOne({ mobile }, { ageVerified: true });

        await Otp.deleteOne({ mobile, otp });

        res.json({ msg: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Verify OTP Error:', error.message);
        res.status(500).send('Server error during OTP verification.');
    }
};
