const express = require('express');
const router = express.Router();
const { getAllUsers, findUser, registerUser } = require('../controllers/users');

router.route('/').get((req, res) => {
        res.render('login'); 
});

router.route('/login').get((req, res) => {
    res.render('login');
}).post(findUser, (req, res) => {
    res.render('homePage');
    })

router.route('/register').get((req, res) => {
    res.render('register');
})
.post(registerUser);



module.exports = router;