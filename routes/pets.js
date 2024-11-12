const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const isAuth = require('../middleware/isAuth');

const {
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    getAdminDashboard,
    updatePet,
} = require('../controllers/pets');

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "task-manager", // You can change this to any folder you prefer
    allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage: storage });

// Home page route
router.route('/').get(isAuth, (req, res) => {
    res.render('homePage');
}).post( isAuth, (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/login');
    })
})


// Gallery route
router.route('/gallery').get(isAuth, getAllPets);

// Admin dashboard routes
router.route('/adminDashboard')
    .get(isAuth, getAdminDashboard)
    .post( isAuth, upload.single('image'), createPet);

    // Add pet routes
router.route('/addPet')
.get(isAuth, (req, res) => res.render('addPet')) 
.post(isAuth, upload.single('image'), async (req, res) => {
    const { name, breed, age, description } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Cloudinary URL or file path
    const newPet = new Pet({ name, breed, age, description, imageUrl });
    await newPet.save();
    res.redirect('gallery');  
});

// Pet profile route
router.route('/pet-profile/:id').get(isAuth, getPetProfile);

// Edit Pet Route
router.route('/edit/:id')
    .get(isAuth, async (req, res) => {
        let pet = await Pet.findById(req.params.id);
        
        // If pet not found, render an error page
        if (!pet) {
            return res.status(404).send('Pet not found');
        }

        // Render the edit form with the current pet data
        res.render('editPet', { pet });
    })
    .post(isAuth, upload.single('image'), updatePet);

router.route('/delete/:id').post(isAuth, deletePet);

module.exports = router;