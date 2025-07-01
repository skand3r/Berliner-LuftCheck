// routes/loc.js
import { Router } from 'express';
import { findAllLocations, findOneLocation } from '../db/locationsCRUDs.js';

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

export default locRouter;
