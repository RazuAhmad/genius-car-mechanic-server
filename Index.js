const express = require("express");
var cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.npcfm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("geniusCarDB");
    const collection = database.collection("Collection");

    // Find A document
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = ObjectId(id);
      const result = await collection.findOne(query);
      res.send(result);
    });

    // Find Multiple Api

    app.get("/services", async (req, res) => {
      const cursor = collection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // Insert A document Api
    app.post("/services", async (req, res) => {
      const allServices = req.body;
      console.log("Hitting the post", allServices);
      const result = await collection.insertOne(allServices);

      res.json(result);
    });

    // Delete APi

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
