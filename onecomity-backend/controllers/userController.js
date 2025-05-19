const User = require('../models/User');

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

// Get nearby users
// exports.getNearbyUsers = async (req, res) => {
//     const userId = req.user.id;
//     const { maxDistance = 10000 } = req.query; // in meters

//     try {
//         const currentUser = await User.findById(userId);
//         if (!currentUser || !currentUser.location) {
//             return res.status(400).json({ msg: 'Current location missing.' });
//         }

//         const users = await User.find({
//             _id: { $ne: userId },
//             activity: currentUser.activity,
//             location: {
//                 $near: {
//                     $geometry: {
//                         type: "Point",
//                         coordinates: currentUser.location.coordinates
//                     },
//                     $maxDistance: parseInt(maxDistance)  // 10km default
//                 }
//             }
//         });

//         res.json({ users });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };

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