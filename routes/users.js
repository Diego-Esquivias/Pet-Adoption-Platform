const express = require('express');
const router = express.Router();
const { getAllUsers, findUser, registerUser } = require('../controllers/users');

router.route('/login').get((req, res) => {
        res.render('login'); 
})
.post(findUser)

router.route('/login/register').get((req, res) => {
    res.render('register');
})
.post(registerUser);

module.exports = router;