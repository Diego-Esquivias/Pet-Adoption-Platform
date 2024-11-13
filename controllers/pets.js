const PetInfo = require('../models/Pet');
const User = require('../models/User'); 
const asyncWrapper = require('../middleware/async');
const cloudinary = require('cloudinary').v2;

const getAllPets = asyncWrapper(async (req, res) => {
    const pets = await PetInfo.find({});
    res.render('gallery', { pets });
});

const createPet = asyncWrapper(async (req, res) => {
    const { name, breed, age, location, behavior, history, description } = req.body;
    // let imageUrl =req.file.path
    // Ensure that an image is uploaded
    if (!req.file) {
        return res.render('addPet', { error: 'Image is required.' });
    }

    try {
        // If you are using Cloudinary for image uploads
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
        const imageUrl =  req.file.path;

        const capitalizedLocation = location.toUpperCase();
        const petData = {
            name,
            breed,
            age,
            location: capitalizedLocation,
            behavior,
            history,
            description,
            imageUrl, 
        };

        await PetInfo.create(petData);  
        res.redirect('/pets');  
    } catch (error) {
        console.error(error);
        return res.render('addPet', { error: 'Something went wrong. Please try again later.' });
    }
});


const getPetProfile = asyncWrapper(async (req, res) => {
    const { id: petID } = req.params; 
    const pet = await PetInfo.findOne({ _id: petID });
    if (!pet) {
        return res.status(404).json({ msg: `No pet with id: ${petID}` });
    }
    if (req.accepts('html')) {
        res.render('profile', { pet });
    } else {
        res.status(200).json({ pet });
    }
});

const deletePet = asyncWrapper(async (req, res) => {
    const { id: petID } = req.params;  // Get the pet ID from the URL parameters
    const pet = await PetInfo.findOne({ _id: petID });

    if (!pet) {
        return res.status(404).json({ msg: `No pet with id: ${petID}` });
    }

    // Delete the pet from the database
    await PetInfo.findOneAndDelete({ _id: petID });

    res.redirect('/pets/adminDashboard'); 
});

const updatePet = asyncWrapper(async (req, res) => {
    const { id: petID } = req.params;
    
    // Extract the updated data
    let updateData = { ...req.body };

    // If there's a new image uploaded
    if (req.file) {
        updateData.imageUrl = req.file.path;
    }

    // Perform the update
    const updatedPet = await PetInfo.findOneAndUpdate(
        { _id: petID },
        updateData,
        {
            new: true,           
            runValidators: true  
        }
    );

    if (!updatedPet) {
        return res.status(404).json({ msg: `Pet with id ${petID} not found.` });
    }

    res.redirect('/pets/adminDashboard');
});

const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({});
    return res.render('gallery', { users });
});

const getAdminDashboard = asyncWrapper(async (req, res) => {
    const [pets, users] = await Promise.all([
        PetInfo.find({}),
        User.find({})
    ]);
    res.render('admin', { pets, users });
});


const deleteUser = asyncWrapper(async (req, res) => {
    const { id: userID } = req.params; 
    const user = await User.findOne({ _id: userID });

    if (!user) {
        return res.status(404).json({ msg: `No pet with id: ${userID}` });
    }

    await User.findOneAndDelete({ _id: userID });

    res.redirect('/pets/adminDashboard'); 
});


module.exports = {
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    updatePet,
    getAllUsers,
    deleteUser,
    getAdminDashboard
};