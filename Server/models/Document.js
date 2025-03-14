const mongoose = require("mongoose")

const DocumentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Please provide a file type"],
  },
  size: {
    type: String,
    required: [true, "Please provide a file size"],
  },
  path: {
    type: String,
    required: [true, "Please provide a file path"],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Document", DocumentSchema)

