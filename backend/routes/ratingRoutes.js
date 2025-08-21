const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { submitRating, updateRating, getRatingsForStoreOwner } = require('../controllers/ratingController');

const router = express.Router();

router.post('/', authenticate, authorize(['normal_user']), submitRating);

router.put('/:id', authenticate, authorize(['normal_user']), updateRating);

router.get('/owner', authenticate, authorize(['store_owner']), getRatingsForStoreOwner);

module.exports = router;
