const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 
const Pet = require('../models/Pet');

const {
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    getAdminDashboard,
    updatePet,
} = require('../controllers/pets');

// Home page route
router.route('/').get((req, res) => {
    res.render('homePage');
});

// Gallery route
router.route('/gallery').get(getAllPets);

// Admin dashboard routes
router.route('/adminDashboard')
    .get(getAdminDashboard)
    .post(upload.single('image'), createPet);

    // Add pet routes
router.route('/addPet')
.get((req, res) => res.render('addPet')) 
.post(upload.single('image'), async (req, res) => {
    const { name, breed, age, description } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Cloudinary URL or file path
    const newPet = new Pet({ name, breed, age, description, imageUrl });
    await newPet.save();
    res.redirect('gallery');  
});

// Pet profile route
router.route('/pet-profile/:id').get(getPetProfile);

// Edit Pet Route
router.route('/edit/:id')
    .get(async (req, res) => {
        let pet = await Pet.findById(req.params.id);
        
        // If pet not found, render an error page
        if (!pet) {
            return res.status(404).send('Pet not found');
        }

        // Render the edit form with the current pet data
        res.render('editPet', { pet });
    })
    .post(upload.single('image'), updatePet);

router.route('/delete/:id').post(deletePet);

module.exports = router;