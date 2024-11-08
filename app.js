const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const PORT = process.env.PORT || 5000;
const petRoutes = require('./routes/pets'); 
const userRoutes = require('./routes/users');
const cloudinary = require("cloudinary").v2;
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Library Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.json());
app.set('view engine', 'ejs');

// Routes
app.use('/pets', petRoutes);
app.use('/login', userRoutes);

// Local Middleware
const notFound = require('./middleware/not-found');
app.use(notFound);

const serverInit = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

serverInit();