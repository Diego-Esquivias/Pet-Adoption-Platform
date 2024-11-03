const PetInfo = require('../models/Pet');
const User = require('../models/User'); 
const asyncWrapper = require('../middleware/async');

const getAllPets = asyncWrapper(async (req, res) => {
    const pets = await PetInfo.find({});
        res.render('gallery', { pets });
});

const createPet = asyncWrapper(async (req, res) => {
    try {
        const pet = await PetInfo.create(req.body);
        res.redirect('/gallery');
    } catch (error) {
        res.render('addPet', { 
            error: 'Please check all required fields are filled correctly'
        });
    }
});

const getPetProfile = asyncWrapper(async (req, res) => {
    const { id: petID } = req.params;
    const pet = await PetInfo.findOne({ _id: petID });
    if (!pet) {
        return res.status(404).json({ msg: `No pet with id: ${petID}` });
    }
    // Check if the request expects JSON or view
    if (req.accepts('html')) {
        res.render('profile', { pet });
    } else {
        res.status(200).json({ pet });
    }
});

const deletePet = asyncWrapper(async (req, res) => {
    const { id: petID } = req.params;
    const pet = await PetInfo.findOneAndDelete({ _id: petID });
    if (!pet) {
        return res.status(404).json({ msg: `No pet with id: ${petID}` });
    }
    res.status(200).json({ msg: `Pet with id: ${petID} deleted` });
});

const updatePet = asyncWrapper(async (req, res) => {
    const { id: petID } = req.params;
    const pet = await PetInfo.findOneAndUpdate({ _id: petID }, req.body, {
        new: true,
        runValidators: true
    });
    if (!pet) {
        return res.status(404).json({ msg: `No pet with id: ${petID}` });
    }
    res.status(200).json({ pet });
});

const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({});
    return res.status(200).json({ users });
});

const getAdminDashboard = asyncWrapper(async (req, res) => {
    const [pets, users] = await Promise.all([
        PetInfo.find({}),
        User.find({})
    ]);
    res.render('admin', { pets, users });
});

module.exports = {
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    updatePet,
    getAllUsers,
    getAdminDashboard
};