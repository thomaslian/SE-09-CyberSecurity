#!/usr/bin/env node
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');
const mongoose = require('mongoose');

const serviceAccount = require('./serviceAccount.json')
const app = express();
dotenv.config();


// Import routes
const locationsRoute = require('./routes/locations');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://camper-278812.firebaseio.com"
});

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log("Connected to DB!");
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/locations', locationsRoute);

// Start listening
app.listen(3000, () => console.log('Node server up and running'));