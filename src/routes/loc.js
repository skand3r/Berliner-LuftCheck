// routes/loc.js
import { Router } from 'express';
import { addLocation, findAllLocations, findOneLocation } from '../db/locationsCRUDs.js';

const locRouter = Router();

// GET /loc → all locations
locRouter.get('/', async (req, res) => {
    const docs = await findAllLocations();
    if (docs) {
        res.status(200).json(docs);
    } else {
        res.status(404).send("No locations found");
    }
});

// GET /loc/:id → specific location
locRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const doc = await findOneLocation(id);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).send("Location not found");
        }
    } catch (e) {
        res.status(400).send("Invalid ID");
    }
});

locRouter.post('/', async (req, res) => {
    //const {name, description, street, zip, city, category, lat, lon} = req.body;
    const locationObj = req.body;

    if (!locationObj || !locationObj.title || !locationObj.street || !locationObj.postal) {
        return res.status(400).send("Missing required fields.")
    }

    try {
        const newId = await addLocation(locationObj);
        res.status(201).setHeader('Location', `/loc/${newId}`).send();
    }

    catch (error) {
        console.error("Insert failed: ", error);
        res.status(500).send("Error inserting location.");
    }
})

export default locRouter;
