const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Otp = require('../models/Otp');

const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


exports.registerUser = async (req, res) => {
    const { email, mobile, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ email, mobile, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.sendOtp = async (req, res) => {
    const { mobile } = req.body;

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
        res.status(500).send('Error sending OTP.');
    }
};



exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ mobile, otp });

        if (!otpRecord) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }

        await User.updateOne({ mobile }, { ageVerified: true });

        await Otp.deleteOne({ mobile, otp });

        res.json({ msg: 'OTP verified successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error during OTP verification.');
    }
};
