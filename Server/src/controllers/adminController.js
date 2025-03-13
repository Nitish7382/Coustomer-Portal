const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        const { customerId, title, description } = req.body;
        const project = new Project({ customerId, title, description });
        await project.save();
        res.status(201).json({ message: "Project created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { progress, files } = req.body;
        await Project.findByIdAndUpdate(projectId, { progress, files }, { new: true });
        res.json({ message: "Project updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
