const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 

const {
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    getAdminDashboard
} = require('../controllers/pets');

// Home page route
router.route('/pets').get((req, res) => {
    res.render('homePage');
});

// Gallery route
router.route('/pets/gallery').get(getAllPets);

// Pet profile route
router.route('/pets/:id').get(getPetProfile);

// Admin dashboard routes
router.route('/pets/adminDashboard')
    .get(getAdminDashboard)
    .delete(deletePet)
    .post(upload.single('mainImage'), createPet);

// Add pet routes
router.route('/pets/addPet')
    .get((req, res) => res.render('addPet'))
    .post(upload.single('mainImage'), createPet);  


module.exports = router;