const admin = require('firebase-admin');
const router = require('express').Router();

const Location = require('../models/Location');
const verifyUser = require('./verifyUser');
const verifyAdmin = require('./verifyAdmin');

// GET ALL LOCATIONS
router.get('/', verifyUser, async (req, res) => {
    try {
        console.log("Getting all locations!");
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (err) {
        console.error("There was an error getting all locations: " + err);
        res.status(500).json(err);
    }
});

// SUBMIT A LOCATION
router.post('/', verifyAdmin, async (req, res) => {
    const location = new Location({
        address: req.body.address,
        author: req.body.author,
        authorId: req.body.authorId,
        description: req.body.description,
        features: req.body.features,
        fireId: req.body.fireId,
        imagePath: req.body.imagePath,
        imageUrl: req.body.imageUrl,
        lat: req.body.lat,
        lng: req.body.lng,
        name: req.body.name,
        parkingType: req.body.parkingType,
        ratings: req.body.ratings,
        vvId: req.body.vvId
    });
    try {
        const savedLocation = await location.save();
        console.log("Location with the following id is successfully written to the database: " + savedLocation._id);
        res.status(200).json({ message: "Location successfully written to database", locationId: savedLocation._id, locationName: location.name, successful: true });
    } catch (err) {
        console.error("There was an error writing a location: " + err);
        res.status(500).json({ message: err, successful: false });
    }
});

// GET ALL FEATURED LOCATIONS
router.get('/featured', verifyUser, async (req, res) => {
    try {
        console.log("Getting featured locations!");
        const locations = await Location.find({ featured: true });
        res.status(200).json(locations);
    } catch (err) {
        console.error("There was an error getting featured locations: " + err);
        res.status(500).send(err);
    }
});

// GET ONE LOCATION
router.get('/:id', verifyUser, async (req, res) => {
    const locationId = req.params.id;
    try {
        console.log("Getting location with ID: " + locationId);
        const location = await Location.findById(locationId);
        res.status(200).json(location);
    } catch (err) {
        console.error("There was an error getting the location with id: " + req.params.id);
        console.error(err);
        res.status(500).json({ message: "There was an error getting the location with id: " + req.params.id, err });
    }
});

// UPDATE ONE LOCATION
router.patch('/:id', verifyAdmin, async (req, res) => {
    const locationData = {
        address: req.body.address,
        author: req.body.author,
        authorId: req.body.authorId,
        description: req.body.description,
        features: req.body.features,
        imagePath: req.body.imagePath,
        imageUrl: req.body.imageUrl,
        lat: req.body.lat,
        lng: req.body.lng,
        name: req.body.name,
        parkingType: req.body.parkingType
    };
    try {
        console.log("Updating location with ID: " + req.params.id);
        const updatedLocation = await Location.updateOne({ _id: req.params.id }, { $set: locationData });
        res.status(200).json({ message: "Location updated successfully!", _id: updatedLocation._id });
    } catch (err) {
        console.error("There was an error updating the location with id: " + req.params.id);
        console.error(err);
        res.status(500).json({ message: "There was an error updating the location with id: " + req.params.id, err });
    }
});

// DELETE ONE LOCATION
router.delete('/:id', verifyAdmin, async (req, res) => {
    const locationId = req.params.id;
    if (locationId == "undefined") {
        return res.status(400).send("Could not find a location with this ID");
    }
    try {
        const location = await Location.findByIdAndDelete(locationId);
        console.log("Deleting location with ID: " + locationId);
        res.status(200).json({ message: "Location deleted successfully!", id: locationId, authorId: location.authorId, imagePath: location.imagePath });
    } catch (err) {
        console.error("There was an error deleting the location: " + err);
        res.status(500).send(err);
    }
});

// SET RATING OF ONE LOCATION
router.patch('/:id/rate', verifyUser, async (req, res) => {
    const locationData = {
        ratings: [{ authorId: req.body.ratings.authorId, stars: req.body.ratings.stars }]
    };
    const locationId = req.params.id;
    try {
        const location = await Location.findById(locationId);
        let updatedLocation = '';
        if (location.ratings === null) {
            updatedLocation = await Location.updateOne({ _id: locationId }, { $set: locationData });
        } else {
            updatedLocation = await Location.updateOne({ _id: locationId }, { $push: locationData });
        }
        console.log("Updating location with ID: " + locationId);
        res.status(200).json({ message: "Location updated successfully!", _id: updatedLocation._id });
    } catch (err) {
        console.error("There was an error updating the location with id: " + locationId);
        console.error(err);
        res.status(500).json({ message: "There was an error updating the location with id: " + locationId, err });
    }
});

// SET LOCATION AS FEATURED
router.patch('/:id/featured', verifyAdmin, async (req, res) => {
    const locationData = { featured: req.body.featured };
    const locationId = req.params.id;

    try {
        let updatedLocation = '';
        updatedLocation = await Location.updateOne({ _id: locationId }, { $set: locationData });
        console.log("Updating location with ID: " + locationId);
        res.status(200).json({ message: "Location updated successfully!", _id: updatedLocation._id, locationData });
    } catch (err) {
        console.error("There was an error updating the location with id: " + locationId);
        console.error(err);
        res.status(500).json({ message: "There was an error updating the location with id: " + locationId, err });
    }
});

module.exports = router;