const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const PORT = process.env.PORT || 5000;
const petRoutes = require('./routes/pets'); 
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const userRoutes = require('./routes/users');
const cloudinary = require("cloudinary").v2;
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const store = new MongoDBSession({
        uri: process.env.MONGOURI,
        collection:'sessions',
})



// Library Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true,             
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
    }
}))

app.use(express.static('./public'));
app.use(express.json());
app.set('view engine', 'ejs');

// app.use((req, res, next) => {
//     console.log('Session ID:', req.sessionID);
//     console.log('Is Authenticated:', req.session.isAuth);
//     next();
// });

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
            console.log(`Server is listening on http://localhost:${PORT}/login`);
        });
    } catch (error) {
        console.log(error);
    }
}

serverInit();