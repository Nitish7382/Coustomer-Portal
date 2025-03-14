import express from "express"
import Project from "../models/Project.js"
import { protect, admin } from "../middleware/auth.js"
import Customer from "../models/Customer.js"

const router = express.Router()

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { title, description, customer, status, progress, startDate, estimatedEndDate } = req.body

    // Check if customer exists
    const customerExists = await Customer.findById(customer)

    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" })
    }

    // Create project
    const project = await Project.create({
      title,
      description,
      customer,
      status: status || "Not Started",
      progress: progress || 0,
      startDate: startDate || Date.now(),
      estimatedEndDate,
      createdBy: req.user._id,
    })

    if (project) {
      res.status(201).json(project)
    } else {
      res.status(400).json({ message: "Invalid project data" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let projects

    if (req.user.role === "admin") {
      // Admin can see all projects
      projects = await Project.find({}).populate("customer", "name email").sort({ createdAt: -1 })
    } else {
      // Customer can only see their projects
      const customer = await Customer.findOne({ user: req.user._id })

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" })
      }

      projects = await Project.find({ customer: customer._id })
        .populate("customer", "name email")
        .sort({ createdAt: -1 })
    }

    res.json(projects)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "customer",
      "name email address squareFeet contactNumber siteLocation buildingType",
    )

    if (project) {
      // Check if user is admin or the customer of this project
      if (req.user.role === "admin") {
        res.json(project)
      } else {
        const customer = await Customer.findOne({ user: req.user._id })

        if (customer && project.customer._id.toString() === customer._id.toString()) {
          res.json(project)
        } else {
          res.status(401).json({ message: "Not authorized to view this project" })
        }
      }
    } else {
      res.status(404).json({ message: "Project not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { title, description, status, progress, estimatedEndDate, actualEndDate } = req.body

    const project = await Project.findById(req.params.id)

    if (project) {
      project.title = title || project.title
      project.description = description || project.description
      project.status = status || project.status
      project.progress = progress !== undefined ? progress : project.progress
      project.estimatedEndDate = estimatedEndDate || project.estimatedEndDate
      project.actualEndDate = actualEndDate || project.actualEndDate

      const updatedProject = await project.save()
      res.json(updatedProject)
    } else {
      res.status(404).json({ message: "Project not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (project) {
      await project.remove()
      res.json({ message: "Project removed" })
    } else {
      res.status(404).json({ message: "Project not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/projects/customer/:customerId
// @desc    Get projects by customer ID
// @access  Private
router.get("/customer/:customerId", protect, async (req, res) => {
  try {
    const customerId = req.params.customerId

    // Check if user is admin or the customer themselves
    if (req.user.role === "admin") {
      const projects = await Project.find({ customer: customerId })
        .populate("customer", "name email")
        .sort({ createdAt: -1 })

      res.json(projects)
    } else {
      const customer = await Customer.findOne({ user: req.user._id })

      if (customer && customer._id.toString() === customerId) {
        const projects = await Project.find({ customer: customerId })
          .populate("customer", "name email")
          .sort({ createdAt: -1 })

        res.json(projects)
      } else {
        res.status(401).json({ message: "Not authorized to view these projects" })
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

