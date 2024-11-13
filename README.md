# Pet-Adoption-Platform

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Environment Variables](#environment-variables)
6. [Routes and Functionality](#routes-and-functionality)
7. [Folder Structure](#folder-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Project Overview

This is a pet adoption web application designed to allow users to view, add, edit, and delete pet profiles. Admin users can manage pets and user accounts through an administrative dashboard. The app uses **MongoDB** for database management, **Cloudinary** for storing images, **Multer** for handling file uploads, and **Express.js** for the backend. 

The application provides functionality for:
- Viewing all pets in a gallery.
- Adding and editing pet profiles with image upload.
- Filtering pets based on breed, location, and age.
- User authentication (login/register) with session-based management.
- Admin dashboard for managing pets and users.

---

## Prerequisites

To run the project locally, you need to have the following installed:
- **Node.js** (version 14 or higher)
- **MongoDB** (or a MongoDB Atlas account)
- **Cloudinary account** (for storing pet images)
- **Git** (optional, for version control)

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/pet-adoption-app.git
    cd pet-adoption-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

---

## Running the Application

1. Set up environment variables by creating a `.env` file in the root directory and add the following:

    ```
    MONGOURI=your_mongodb_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    SESSION_SECRET=your_session_secret
    ```

2. Run the app:
    ```bash
    npm start
    ```

   The app will run on `http://localhost:5000` by default.

---

## Environment Variables

The following environment variables must be set in your `.env` file:

- **MONGOURI**: Your MongoDB URI (use MongoDB Atlas if using a cloud database).
- **CLOUDINARY_CLOUD_NAME**: Your Cloudinary cloud name (for storing images).
- **CLOUDINARY_API_KEY**: Your Cloudinary API key.
- **CLOUDINARY_API_SECRET**: Your Cloudinary API secret.
- **SESSION_SECRET**: A secret string used for signing the session ID cookie.

---

## Routes and Functionality

### 1. User Routes

- **POST `/login`**: User login. Verifies credentials and starts a session.
  - Request Body: `{ email, password }`
  - Response: Redirects to `/pets` for regular users or `/pets/adminDashboard` for admins.

- **POST `/register`**: User registration. Hashes the password and creates a new user.
  - Request Body: `{ username, email, password }`
  - Response: Redirects to the home page with a success message.

### 2. Pet Routes

- **GET `/pets`**: Displays all pets in the gallery.
  - No request body needed.
  - Response: Renders a gallery view with all pets.

- **POST `/pets/gallery`**: Filter pets by breed, location, and age.
  - Request Body: `{ breed, location, age, clearFilters }`
  - Response: Filters pets and returns the updated gallery.

- **GET `/pets/pet-profile/:id`**: View details of a specific pet.
  - Request Parameters: `{ id }` (pet ID).
  - Response: Renders the pet's profile page.

- **GET `/pets/addPet`**: Admin page for adding a new pet.
  - Response: Renders a form to create a new pet.

- **POST `/pets/addPet`**: Submit new pet data (including image).
  - Request Body: `{ name, breed, age, location, behavior, history, description, image }`
  - Response: Redirects to `/pets` after successful creation.

- **GET `/pets/edit/:id`**: Admin page for editing a pet's information.
  - Request Parameters: `{ id }` (pet ID).
  - Response: Renders an edit form for the pet.

- **POST `/pets/edit/:id`**: Submit edited pet data (including image).
  - Request Parameters: `{ id }` (pet ID).
  - Request Body: `{ name, breed, age, location, behavior, history, description, image }`
  - Response: Redirects to the admin dashboard.

- **POST `/pets/pet/delete/:id`**: Delete a pet by ID.
  - Request Parameters: `{ id }` (pet ID).
  - Response: Redirects to `/pets/adminDashboard` after deletion.

### 3. Admin Routes

- **GET `/pets/adminDashboard`**: Admin dashboard to view and manage all pets and users.
  - Response: Renders an admin dashboard with a list of pets and users.

- **POST `/pets/user/delete/:id`**: Delete a user by ID (admin only).
  - Request Parameters: `{ id }` (user ID).
  - Response: Redirects to the admin dashboard after deletion.

---

## Folder Structure

/pet-adoption-app
│
├── /controllers
│   ├── pets.js          # Controller for pet-related routes
│   ├── users.js         # Controller for user authentication
│
├── /models
│   ├── Pet.js           # Mongoose model for Pet data
│   ├── User.js          # Mongoose model for User data
│
├── /routes
│   ├── pets.js          # Routes for pet-related operations
│   ├── users.js         # Routes for user-related operations
│
├── /middleware
│   ├── async.js         # Wrapper for handling async functions
│   ├── isAuth.js        # Middleware to check user authentication
│   ├── not-found.js     # Middleware for handling 404 errors
│
├── /public
│   ├── /images          # Directory for static images
│
├── /views
│   ├── homePage.ejs     # Home page view
│   ├── gallery.ejs      # Gallery page for viewing pets
│   ├── profile.ejs      # Pet profile page
│   ├── addPet.ejs       # Form for adding new pets
│   ├── editPet.ejs      # Form for editing existing pets
│   ├── admin.ejs        # Admin dashboard view
│   ├── login.ejs        # Login page view
│
├── .env                 # Environment variables
├── app.js               # Main application setup file
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation