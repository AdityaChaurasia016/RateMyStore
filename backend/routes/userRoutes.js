const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { getUsers, getUserById, updatePassword, addUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', authenticate, authorize(['system_admin']), addUser);

router.get('/', authenticate, authorize(['system_admin']), getUsers);

router.get('/:id', authenticate, authorize(['system_admin']), getUserById);

router.put('/password', authenticate, updatePassword);

module.exports = router;