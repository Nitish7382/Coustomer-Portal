import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  estimatedEndDate: {
    type: Date,
  },
  actualEndDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const Project = mongoose.model("Project", projectSchema)

export default Project

