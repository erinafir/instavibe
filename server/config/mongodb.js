require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_DB

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db('hck_72');

module.exports = database