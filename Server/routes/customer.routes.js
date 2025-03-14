import express from "express"
import Customer from "../models/Customer.js"
import { protect, admin } from "../middleware/auth.js"
import User from "../models/User.js" // Import the User model

const router = express.Router()

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, address, squareFeet, contactNumber, email, siteLocation, buildingType } = req.body

    // Check if customer with this email already exists
    const customerExists = await Customer.findOne({ email })

    if (customerExists) {
      return res.status(400).json({ message: "Customer with this email already exists" })
    }

    // Create user account for customer
    const user = await User.create({
      name,
      email,
      password: "123", // Generate random password
      role: "customer",
    })

    // Create customer
    const customer = await Customer.create({
      user: user._id,
      name,
      address,
      squareFeet,
      contactNumber,
      email,
      siteLocation,
      buildingType,
      createdBy: req.user._id,
    })

    if (customer) {
      res.status(201).json(customer)
    } else {
      res.status(400).json({ message: "Invalid customer data" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 })
    res.json(customers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (customer) {
      // Check if user is admin or the customer themselves
      if (req.user.role === "admin" || customer.user.toString() === req.user._id.toString()) {
        res.json(customer)
      } else {
        res.status(401).json({ message: "Not authorized to view this customer" })
      }
    } else {
      res.status(404).json({ message: "Customer not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, address, squareFeet, contactNumber, email, siteLocation, buildingType } = req.body

    const customer = await Customer.findById(req.params.id)

    if (customer) {
      customer.name = name || customer.name
      customer.address = address || customer.address
      customer.squareFeet = squareFeet || customer.squareFeet
      customer.contactNumber = contactNumber || customer.contactNumber
      customer.email = email || customer.email
      customer.siteLocation = siteLocation || customer.siteLocation
      customer.buildingType = buildingType || customer.buildingType

      const updatedCustomer = await customer.save()
      res.json(updatedCustomer)
    } else {
      res.status(404).json({ message: "Customer not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (customer) {
      await customer.remove()
      res.json({ message: "Customer removed" })
    } else {
      res.status(404).json({ message: "Customer not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

