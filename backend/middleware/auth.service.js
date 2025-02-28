const jwt = require('jsonwebtoken');
const service = require('../models/serviceProvider.model');
require('dotenv').config();

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(400).send({
                success: false,
                message: "Not authorized - No token provided"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(400).send({
                success: false,
                message: "Not authorized - Invalid token"
            });
        }

        const currentUser = await service.findById(decode.id);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach the user to the request object for access in later middleware
        req.user = currentUser;

        // Pass control to the next middleware or route handler
        next();

    } catch (err) {
        res.status(500).json({
            message: err.message,
            error: 'Error in protect route'
        });
    }
};

module.exports = { protectRoute };

