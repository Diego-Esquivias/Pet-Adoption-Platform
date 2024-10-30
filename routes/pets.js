const express = require('express');
const router = express.Router();

const{
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    getAllUsers,
} = require('../controllers/pets');

router.route('/').get((req, res) => {
    res.render('homePage'); // Render the home.ejs file
});

router.route('/gallery').get(getAllPets, (req, res) => {
    res.render('gallery', { pets: req.pets }); // Render gallery.ejs and pass pets data
});

router.route('/pet-profile/:id').get(getPetProfile, (req, res) => {
    res.render('profile', { pet: req.pet }); // Render petProfile.ejs with pet data
});

router.route('/login').get((req, res) => {
    res.render('login'); // Render login.ejs
});

router.route('/adminDashboard').get(getAllPets, getAllUsers, (req, res) => {
        res.render('admin.ejs', {
            pets: req.pets,
            users: req.users
        }); // Render adminDashboard.ejs and pass pets and users data
    })
    .delete(deletePet)
    .post(createPet);

module.exports = router;