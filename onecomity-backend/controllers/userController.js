const User = require('../models/User');
const {uploadToS3, deleteFromS3} = require('../utils/s3'); // Assuming you have a utility function for S3 uploads

// Save selected activity + location
exports.setUserActivity = async (req, res) => {
    const userId = req.user.id;
    const { activity, coordinates } = req.body;

    if (!activity || !coordinates || coordinates.length !== 2) {
        return res.status(400).json({ msg: 'Activity and coordinates required.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                activity,
                location: {
                    type: "Point",
                    coordinates
                }
            },
            { new: true }
        );
        res.json({ msg: 'Activity and location updated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getNearbyUsers = async (req, res) => {
  const { lat, lng, activity } = req.query;

  if (!lat || !lng || !activity) {
    return res.status(400).json({ msg: 'Missing parameters' });
  }

  try {
    const users = await User.find({
      activity,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000, // 5 km
        },
      },
    }).select('-password'); // Don't return password

    console.log('🔍 Nearby API hit:', { activity, lat, lng });
    console.log('🔎 Matched users:', users.length, users.map(u => u.email));

    res.json(users);
  } catch (err) {
    console.error('❌ Nearby search error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateActivity = async (req, res) => {
    
  try {
    const userId = req.user.id;
    const { activity } = req.body;
    console.log('Updating Activity', activity);
    console.log('Updating activity for user:', userId);

    if (!['weed', 'wine', 'water'].includes(activity)) {
      return res.status(400).json({ msg: 'Invalid activity' });
    }
    const user = await User.findByIdAndUpdate(userId, { activity }, { new: true });
    console.log('Mongoose user after update:', user);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update activity' });
  }
};


// GET /user/me
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /user/update
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Profile update failed' });
  }
};

// DELETE /user/delete
exports.deleteMyAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // 🔥 Delete profile picture from S3 if exists
    if (user.profilePic) {
      await deleteFromS3(user.profilePic);
    }

    // 🧹 Delete user from DB
    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: 'Account and profile picture deleted successfully' });
  } catch (err) {
    console.error('❌ Delete account error:', err);
    res.status(500).json({ msg: 'Failed to delete account' });
  }
};
//POST /user/upload-profile-pic
exports.uploadProfilePic = async (req, res) => {
  try {
    console.log('Uploading profile pic for user:', req.user.id);
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileUrl = await uploadToS3(req.file); // returns public URL
    const user = await User.findByIdAndUpdate(req.user.id, { profilePic: fileUrl }, { new: true }).select('-password');

    res.json({ profilePic: fileUrl });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};