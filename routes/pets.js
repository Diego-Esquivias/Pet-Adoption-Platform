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
    deleteUser,
    getAdminDashboard,
    updatePet,
} = require('../controllers/pets');

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    folder: "pet-adoption-site",
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
router.route('/gallery').get(isAuth, getAllPets).post(isAuth, async (req, res) => {
    const { breed, location, age } = req.body;
    const { clearFilters } = req.body;

    if (clearFilters) {
        return res.redirect('/pets/gallery');    
    }

    let filter = {};

    // Add filters based on the user's selection
    if (breed) filter.breed = breed;
    if (location) filter.location = location;
    
    // Handle age filter. Convert age range to numeric range if necessary
    if (age) {
        let ageRange = age.split('-');
        if (ageRange.length === 2) {
            // If the user selected an age range (e.g., "3-6")
            filter.age = { $gte: ageRange[0], $lte: ageRange[1] };
        } else if (age === "12+") {
            // If the user selected "12+" (12 years and older)
            filter.age = { $gte: 12 };
        }
    }

    try {
        // Find pets that match the filters
        const pets = await Pet.find(filter);

        // Render the gallery page with the filtered pets
        res.render('gallery', { pets });
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).send('Error fetching pets');
    }
});

// Admin dashboard routes
router.route('/adminDashboard')
    .get(isAuth, getAdminDashboard)
    .post(isAuth, upload.single('image'), createPet);

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

router.route('/pet/delete/:id').post(isAuth, deletePet);

router.route('/user/delete/:id').post(isAuth, deleteUser);



module.exports = router;