const express = require('express');
const router = express.Router();

const{
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
} = require('../controllers/pages');

router.route('/')
router.route('/gallery').get(getAllPets)
router.route('/pet-profile/:id').get(getPetProfile)
router.route('/login')
router.route('/adminDashboard').get(getAllPets, getAllUsers).delete(deletePet).post(createPet)

module.exports = router;