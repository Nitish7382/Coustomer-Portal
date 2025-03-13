const express = require('express');
const { createProject, getCustomerProjects } = require('../controllers/projectController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getCustomerProjects);

module.exports = router;
