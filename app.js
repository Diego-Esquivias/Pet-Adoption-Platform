const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const PORT = process.env.PORT || 5000;
const pets = require('./routes/pets'); 
const users = require('./routes/users');

// Set view engine
app.set('view engine', 'ejs');

// Library Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.json());

// Routes
app.use('/', pets);
app.use('/login', users);


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