const asyncWrapper = require('../middleware/async');
const PetInfo = require('../models/Pet');
const User = ('../models/User')
const bcrypt = require('bcrypt');

const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({});
    return res.status(200).json({users});
})

const findUser = asyncWrapper(async (req, res) => {
    const { username } = req.body; // Change this to req.body since you're getting username from the body
    const { password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        // Render login with an error message if user is not found
        return res.render('login', { msg: `No user with the username ${username}` });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // Render login with an error message if password is incorrect
        return res.render('login', { msg: 'Invalid password' });
    }

    // If the username exists and the password matches, render the home page
    return res.render('homePage', { msg: 'Login successful', user: user });
});

const registerUser = asyncWrapper(async (req, res) => {
    const { username, password } = req.body;   
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await User.create({ username, password: hashedPassword });
    return res.render('homePage', { msg: 'User registered successfully', user: newUser });
})

module.exports = {
    getAllUsers,
    findUser,
    registerUser
}