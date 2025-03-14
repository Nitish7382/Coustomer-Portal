import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import customerRoutes from "./routes/customer.routes.js"
import projectRoutes from "./routes/project.routes.js"
import updateRoutes from "./routes/update.routes.js"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Set up file storage
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use("/uploads", express.static(join(__dirname, "uploads")))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/updates", updateRoutes)

// Basic route
app.get("/", (req, res) => {
  res.send("Project Management API is running")
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

