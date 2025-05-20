const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Otp = require('../models/Otp');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper: Generate random, Reddit-style username
function generateUniqueUsername() {
    const randomStr = crypto.randomBytes(3).toString('hex'); // 6 chars
    return `comity_user_${randomStr}`;
}

function generateUniqueUsername() {
    const adjectives = [
        'happy', 'bouncy', 'clever', 'witty', 'brave', 'kind', 'lucky', 'fancy', 'silly', 'bright'
    ];
    const animals = [
        'fox', 'panda', 'eagle', 'bear', 'koala', 'otter', 'whale', 'wolf', 'owl', 'lynx'
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const randomStr = crypto.randomBytes(2).toString('hex'); // 4 hex chars

    return `comity_${adj}${animal}_${randomStr}`; // e.g. comity_sillyotter_ab12
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
