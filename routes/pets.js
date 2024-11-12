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
    folder: "task-manager",
    allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage: storage });

// Home page route
router.route('/').get(isAuth, (req, res) => {
    res.render('homePage');
}).post( isAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.clearCookie('connect.sid');  
        console.log('Logged out successfully');
        res.redirect('/login');
    });
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
.post(isAuth, upload.single('image'), createPet); 

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