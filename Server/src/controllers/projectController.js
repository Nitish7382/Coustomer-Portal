const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    const { customerId, title, description, progress } = req.body;

    const newProject = new Project({
        customerId,
        title,
        description,
        progress,
        images: [],
        videos: [],
        documents: []
    });

    await newProject.save();
    res.json({ message: "Project created successfully" });
};

exports.getCustomerProjects = async (req, res) => {
    const projects = await Project.find({ customerId: req.user.id });
    res.json(projects);
};
