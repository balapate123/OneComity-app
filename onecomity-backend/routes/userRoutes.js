const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { setUserActivity, getNearbyUsers, updateActivity  } = require('../controllers/userController');

router.post('/activity', verifyToken, setUserActivity);
router.get('/nearby', verifyToken, getNearbyUsers);
router.patch('/activity', verifyToken, updateActivity);
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: 'User not found' });
  }
});


module.exports = router;
