import { MongoClient, ObjectId } from "mongodb";

// Replace db_user, db_pass, db_name, db_collection
const db_user = 'webapp_skander';
const db_pass = 'vXePo9vaw';
const db_name = 'webapp';
const db_collection = 'locations';
const dbHostname = "mongodb1.f4.htw-berlin.de"
const dbPort = 27017
const uri = `mongodb://${db_user}:${db_pass}@${dbHostname}:${dbPort}/${db_name}`;

export const findOneLocation = async function (objId) {
    const client = new MongoClient(uri);
    console.log("DB: " + objId);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection);
        const query = { _id: new ObjectId(objId) };
        const doc = await locations.findOne(query);
        return doc;
    } finally {
        // Ensures that the client will close when finished and on error
        await client.close();
    }
};

export const findAllLocations = async function () {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection);
        const query = {};
        const cursor = locations.find(query);
        // Print a message if no documents were found
        if ((await locations.countDocuments(query)) === 0) {
            console.log("No documents found!");
            return null;
        }
        let docs = new Array();
        for await (const doc of cursor) {
            docs.push(doc);
        }
        return docs;
    } finally {
        // Ensures that the client will close when finished and on error
        await client.close();
    }
};

export const addLocation = async function (locationObj) {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection);

        const response = await locations.insertOne(locationObj);

        console.log("new Location ID:", response.insertedId)
        return response.insertedId
    }
    finally {
        client.close();
    }
}

export const updateLocation = async function (locationId, locationObj) {
    const client = new MongoClient(uri)
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection);

        const response = await locations.updateOne({ _id: new ObjectId(locationId) }, { $set: locationObj });

        return response
    }
    finally {
        client.close();
    }
}

export const deleteLocation = async function (locationId) {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection);

        const response = await locations.deleteOne({ _id: new ObjectId(locationId) });

        return response
    }
    finally {
        client.close();
    }
}