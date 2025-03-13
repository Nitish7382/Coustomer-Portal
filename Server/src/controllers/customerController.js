const User = require('../models/User');

exports.getCustomers = async (req, res) => {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
};
