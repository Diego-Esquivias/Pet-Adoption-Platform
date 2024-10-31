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

router.route('/gallery').get((req, res) => {
    let pets = getAllPets;
    res.render('gallery', { pets: pets }); // Render gallery.ejs and pass all pets data
});

router.route('/pet-profile/:id').get((req, res) => {
    let profile = getPetProfile;
    res.render('profile', { pet: profile }); // Render petProfile.ejs with pet profile data
});

router.route('/adminDashboard').get((req, res) => {
        let pets = getAllPets;
        let users  = getAllUsers;
        res.render('admin.ejs', {
            pets: pets,
            users: users
        }); // Render adminDashboard.ejs and pass pets and users data
    })
    .delete(deletePet)
    .post(createPet);

module.exports = router;