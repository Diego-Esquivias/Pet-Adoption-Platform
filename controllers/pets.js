const PetInfo = require('../models/Pet');
const asyncWrapper = require('../middleware/async');
const User = ('../models/User')

const getAllPets = asyncWrapper(async (req, res) => {
    const pets = await PetInfo.find({});
    res.status(200).json({pets});
});

const createPet = asyncWrapper(async (req, res) => {
    const pet = await PetInfo.create(req.body);
    res.status(201).json({pet});
})

const getPetProfile = asyncWrapper(async (req, res) => {
    const {id: petID} = req.params;
    const pet = await PetInfo.findOne({_id: petID});
    if(!pet){
        return res.status(404).json({msg: `No pet with id: ${petID}`});
    }
    res.status(200).json({pet});
})

const deletePet = asyncWrapper(async (req, res) => {
    const {id: petID} = req.params;
    const pet = await PetInfo.findOneAndDelete({_id: petID});
    if(!pet){
        return res.status(404).json({msg: `No pet with id: ${petID}`});
    }
    res.status(200).json({msg: `Pet with id: ${petID} deleted`});
})

const updatePet = asyncWrapper(async (req, res) => {
    const {id: petID} = req.params;
    const pet = await PetInfo.findOneAndUpdate({_id: petID}, req.body, {new: true, runValidators: true});
    if(!pet){
        return res.status(404).json({msg: `No pet with id: ${petID}`});
    }
    res.status(200).json({pet});
})

const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({});
    return res.status(200).json({users});
})

module.exports = {
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    updatePet,
    getAllUsers,
}