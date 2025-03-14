const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const { register, login, adminLogin, getMe } = require("../controllers/auth")

router.post("/register", register)
router.post("/customer-login", login)
router.post("/admin-login", adminLogin)
router.get("/me", protect, getMe)

module.exports = router

