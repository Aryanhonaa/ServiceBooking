const jwt = require('jsonwebtoken');
const serviceModel = require('../models/serviceProvider.model');
const userModel = require('../models/user.model');
const adminModel = require('../models/admin');
require('dotenv').config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Not authorized - No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Not authorized - Invalid token"
      });
    }

    
    let currentUser = await serviceModel.findById(decoded.id);
    if (!currentUser) {
      
      currentUser = await userModel.findById(decoded.id);
      if (!currentUser) {
        // Try finding user in admin model
        currentUser = await adminModel.findById(decoded.id);
      }
    }

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = currentUser;
    next();

  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: 'Error in protect route'
    });
  }
};

module.exports = protectRoute;
