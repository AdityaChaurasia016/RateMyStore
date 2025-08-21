const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { addStore, getStores, getStoresWithRatings } = require('../controllers/storeController');

const router = express.Router();

router.post('/', authenticate, authorize(['system_admin']), addStore);

router.get('/', authenticate, authorize(['system_admin', 'normal_user', 'store_owner']), getStoresWithRatings);

module.exports = router;
