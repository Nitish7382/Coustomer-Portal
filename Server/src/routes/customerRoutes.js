const express = require('express');
const { getCustomers } = require('../controllers/customerController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getCustomers);

module.exports = router;
