const express = require('express');
const { createProject, updateProject } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/projects', authMiddleware, createProject); // Create a new project
router.put('/projects/:projectId', authMiddleware, updateProject); // Update project details

module.exports = router;
