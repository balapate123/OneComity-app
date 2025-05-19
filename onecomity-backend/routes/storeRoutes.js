const express = require('express');
const router = express.Router();
const { getNearbyStores } = require('../controllers/storeController');

router.get('/', getNearbyStores);

module.exports = router;
