const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/multer'); // <-- multer middleware

const {
  setUserActivity,
  getNearbyUsers,
  updateActivity,
  getMyProfile,
  updateProfile,
  deleteMyAccount,
  uploadProfilePic
} = require('../controllers/userController');

router.post('/activity', verifyToken, setUserActivity);
router.get('/nearby', verifyToken, getNearbyUsers);
router.patch('/activity', verifyToken, updateActivity);

// Existing /me route replaced with proper controller
router.get('/me', verifyToken, getMyProfile);

// 🆕 New Routes
router.put('/update', verifyToken, updateProfile);
router.delete('/delete', verifyToken, deleteMyAccount);
router.post('/upload-profile-pic', verifyToken, upload.single('image'), uploadProfilePic);


module.exports = router;
