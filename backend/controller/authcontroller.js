const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

// REGISTER USER
const registeruser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Registration successful
        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id)
        });

    } catch (error) {
        console.log("Registration Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// LOGIN USER
const loginuser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (
            existingUser &&
            (await bcrypt.compare(password, existingUser.password))
        ) {
            return res.json({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                token: generateToken(existingUser._id)
            });
        } else {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

    } catch (error) {
        console.log("Login Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL USERS (ADMIN)
const getusers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");

        return res.json(users);

    } catch (error) {
        console.log("Get Users Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    registeruser,
    loginuser,
    getusers
};