const User = require("../models/User")
const Customer = require("../models/Customer")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 200, res)
})

// @desc    Login customer
// @route   POST /api/auth/customer-login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400))
  }

  // Check for user
  const user = await User.findOne({ email, role: "customer" }).select("+password")

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401))
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401))
  }

  // Get customer details
  const customer = await Customer.findOne({ user: user._id })

  if (!customer) {
    return next(new ErrorResponse("Customer profile not found", 404))
  }

  sendTokenResponse(user, 200, res, { customer })
})

// @desc    Login admin
// @route   POST /api/auth/admin-login
// @access  Public
exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400))
  }

  // Check for user
  const user = await User.findOne({ email, role: "admin" }).select("+password")

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401))
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401))
  }

  sendTokenResponse(user, 200, res)
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  const userData = { ...user._doc }

  // If user is a customer, get customer details
  if (user.role === "customer") {
    const customer = await Customer.findOne({ user: user._id })
    if (customer) {
      userData.customer = customer
    }
  }

  res.status(200).json(userData)
})

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, additionalData = {}) => {
  // Create token
  const token = user.getSignedJwtToken()

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    ...additionalData,
  }

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  })
}

