const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const pets = require('./routes/pets');
const PORT = process.env.PORT || 5000;

// Set view engine
app.set('view engine', 'ejs');

// Library Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.json());

// Routes
app.use('/', require('./routes/pets'));


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