const PetInfo = require('../models/Pet');
const User = require('../models/User'); 
const asyncWrapper = require('../middleware/async');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload'); 

const getAllPets = asyncWrapper(async (req, res) => {
    const pets = await PetInfo.find({});
    res.render('gallery', { pets });
});

const createPet = asyncWrapper(async (req, res) => {
    console.log("Received request:", req.body); // Debugging line
    if (!req.file) {
        console.log("No file uploaded."); // Debugging line
        return res.render('addPet', { error: 'Image is required.' });
    }

    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'pet-adoption-site',
        });

        const petData = {
            ...req.body,
            mainImage: cloudinaryResponse.secure_url // Ensure this is the correct field name
        };

        console.log("Pet data to save:", petData); // Debugging line
        await PetInfo.create(petData);

        res.redirect('/gallery');
    } catch (error) {
        console.error('Error creating pet:', error);
        res.render('addPet', { error: 'Error saving pet data. Please try again.' });
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
    const { id: petID } = req.params;
    const pet = await PetInfo.findOne({ _id: petID });
    
    if (!pet) {
        return res.status(404).json({ msg: `No pet with id: ${petID}` });
    }

    // Delete image from Cloudinary if it exists
    if (pet.mainTimage) {
        try {
            // Extract public_id from the URL
            const publicId = pet.mainTimage.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(`pets/${publicId}`);
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
        }
    }

    await PetInfo.findOneAndDelete({ _id: petID });
    res.status(200).json({ msg: `Pet with id: ${petID} deleted` });
});

const updatePet = asyncWrapper(async (req, res) => {
    const { id: petID } = req.params;
    
    let updateData = { ...req.body };

    // Handle image update if a new file is uploaded
    if (req.file) {
        try {
            // Upload new image
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
                folder: 'pets'
            });
            
            updateData.mainTimage = cloudinaryResponse.secure_url;

            // Delete old image if it exists
            const oldPet = await PetInfo.findById(petID);
            if (oldPet?.mainTimage) {
                const publicId = oldPet.mainTimage.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(`pets/${publicId}`);
            }
        } catch (error) {
            console.error('Error updating image:', error);
            return res.status(500).json({ msg: 'Error updating image' });
        }
    }

    const pet = await PetInfo.findOneAndUpdate(
        { _id: petID }, 
        updateData, 
        {
            new: true,
            runValidators: true
        }
    );

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