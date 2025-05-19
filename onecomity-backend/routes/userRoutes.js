const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { setUserActivity, getNearbyUsers } = require('../controllers/userController');

router.post('/activity', verifyToken, setUserActivity);
router.get('/nearby', verifyToken, getNearbyUsers);

module.exports = router;
