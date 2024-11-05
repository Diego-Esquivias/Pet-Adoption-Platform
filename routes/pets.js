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
router.route('/').get((req, res) => {
    res.render('homePage');
});

// Gallery route
router.route('/gallery').get(getAllPets);

// Pet profile route
router.route('/:id').get(getPetProfile);

// Admin dashboard routes
router.route('/adminDashboard')
    .get(getAdminDashboard)
    .delete(deletePet)
    .post(upload.single('mainImage'), createPet);

// Add pet routes
router.route('/addPet')
    .get((req, res) => res.render('addPet'))
    .post(upload.single('mainImage'), createPet);  


module.exports = router;