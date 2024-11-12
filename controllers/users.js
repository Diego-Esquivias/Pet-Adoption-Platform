const { request } = require('express');
const asyncWrapper = require('../middleware/async');    
const PetInfo = require('../models/Pet');
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const store = new MongoDBSession({
    uri: process.env.MONGOURI,
    collection:'sessions',
})



const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({});
    return res.status(200).json({users});
})

const findUser = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.render('login', { msg: `No user with the username ${email}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);  
    if (!isMatch) {
        return res.render('login', { msg: 'Invalid password' });
    }

    // On successful login, set session variables
    req.session.isAuth = true; 
    req.session.userId = user._id;  

    // Redirect based on user role or success
    if (req.session.isAuth && user.role === 'admin') {
        return res.redirect('pets/adminDashboard');
    } else {
        return res.redirect('/pets');  
    }
});


const registerUser = asyncWrapper(async (req, res) => {
    const { username, email, password } = req.body;   
    const hashedPassword = await bcrypt.hash(password, 10); 
    const userData = { username, email, password: hashedPassword };
    const newUser = await User.create(userData);
    return res.render('homePage', { msg: 'User registered successfully', user: newUser });
});

module.exports = {
    getAllUsers,
    findUser,
    registerUser
}