const express = require('express');
const router = express.Router();

const {
    getAllPets,
    createPet,
    getPetProfile,
    deletePet,
    getAdminDashboard
} = require('../controllers/pets');

router.route('/').get((req, res) => {
    res.render('homePage');
});

router.route('/gallery').get(getAllPets);

router.route('/pet-profile/:id').get(getPetProfile);

router.route('/adminDashboard')
    .get(getAdminDashboard)
    .delete(deletePet)
    .post(createPet);

    router.route('/addPet')
    .get((req, res) => {
        res.render('addPet');
    })
    .post(createPet);


module.exports = router;