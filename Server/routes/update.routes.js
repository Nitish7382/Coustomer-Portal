import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import Update from "../models/Update.js"
import Project from "../models/Project.js"
import { protect, admin } from "../middleware/auth.js"
import Customer from "../models/Customer.js"

const router = express.Router()

// Set up file storage
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const uploadsDir = join(__dirname, "../uploads")

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|webm|mov/
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedFileTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX, MP4, WEBM, and MOV files are allowed."))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
})

// Helper function to determine file type
const getFileType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image"
  if (mimetype.startsWith("video/")) return "video"
  return "document"
}

// @route   POST /api/updates
// @desc    Create a new update
// @access  Private/Admin
router.post("/", protect, admin, upload.array("files", 10), async (req, res) => {
  try {
    const { project, title, description, progress } = req.body

    // Check if project exists
    const projectExists = await Project.findById(project)

    if (!projectExists) {
      // Delete uploaded files if project doesn't exist
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path)
        })
      }
      return res.status(404).json({ message: "Project not found" })
    }

    // Process files
    const files = req.files
      ? req.files.map((file) => ({
          type: getFileType(file.mimetype),
          path: file.path.replace(`${__dirname}/../`, ""),
          originalName: file.originalname,
          mimeType: file.mimetype,
        }))
      : []

    // Create update
    const update = await Update.create({
      project,
      title,
      description,
      progress,
      files,
      createdBy: req.user._id,
    })

    if (update) {
      // Update project progress
      projectExists.progress = progress
      if (progress === 100) {
        projectExists.status = "Completed"
        projectExists.actualEndDate = Date.now()
      } else if (progress > 0) {
        projectExists.status = "In Progress"
      }
      await projectExists.save()

      res.status(201).json(update)
    } else {
      // Delete uploaded files if update creation fails
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path)
        })
      }
      res.status(400).json({ message: "Invalid update data" })
    }
  } catch (error) {
    console.error(error)
    // Delete uploaded files if there's an error
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path)
      })
    }
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/updates/project/:projectId
// @desc    Get updates by project ID
// @access  Private
router.get("/project/:projectId", protect, async (req, res) => {
  try {
    const projectId = req.params.projectId

    // Check if project exists
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is admin or the customer of this project
    if (req.user.role === "admin") {
      const updates = await Update.find({ project: projectId }).sort({ createdAt: -1 })

      res.json(updates)
    } else {
      const customer = await Customer.findOne({ user: req.user._id })

      if (customer && project.customer.toString() === customer._id.toString()) {
        const updates = await Update.find({ project: projectId }).sort({ createdAt: -1 })

        res.json(updates)
      } else {
        res.status(401).json({ message: "Not authorized to view these updates" })
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/updates/:id
// @desc    Get update by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const update = await Update.findById(req.params.id)

    if (!update) {
      return res.status(404).json({ message: "Update not found" })
    }

    // Get project to check authorization
    const project = await Project.findById(update.project)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is admin or the customer of this project
    if (req.user.role === "admin") {
      res.json(update)
    } else {
      const customer = await Customer.findOne({ user: req.user._id })

      if (customer && project.customer.toString() === customer._id.toString()) {
        res.json(update)
      } else {
        res.status(401).json({ message: "Not authorized to view this update" })
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/updates/:id
// @desc    Delete update
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const update = await Update.findById(req.params.id)

    if (!update) {
      return res.status(404).json({ message: "Update not found" })
    }

    // Delete files
    if (update.files && update.files.length > 0) {
      update.files.forEach((file) => {
        const filePath = join(__dirname, "..", file.path)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      })
    }

    await update.remove()
    res.json({ message: "Update removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

