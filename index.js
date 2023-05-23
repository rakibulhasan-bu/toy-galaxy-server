const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// testing server here
app.get('/', (req, res) => {
    res.send('Toy Galaxy is Running in server')
});

// mongodb server functionality start here

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.oz0lbz6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // database name and collection name
        const database = client.db("toyGalaxyDB");
        const toyCollection = database.collection("toys");
        const blogCollection = database.collection("blogs");

        // // indexing for toy name
        // const result = await toyCollection.createIndex({ name: 1 }, { name: 'toyNameIndex' })
        // get all the toys for all toys page
        app.get("/allToys/:text", async (req, res) => {
            const text = req.params.text;
            if (text == 'Speedy_Racers' || text == 'Monster_Machines' || text == 'Rescue_Heroes' || text == 'Everyday_City_Cars' || text == 'Construction_Crew') {
                const result = await toyCollection.find({ subCategory: text }).sort({ price: 1 }).toArray();
                res.send(result)
            } else {
                const result = await toyCollection.find({}).limit(20).sort({ price: 1 }).toArray();
                res.send(result)
            }
        })

        // get myToys based on email address
        app.get('/myToys/:email', async (req, res) => {
            const result = await toyCollection.find({ email: req.params.email }).sort({ price: 1 }).toArray();
            res.send(result);
        })
        // get single toy data
        app.get('/singleToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        // search toy name result
        app.get('/searchByToyName/:text', async (req, res) => {
            const text = req.params.text;
            const result = await toyCollection.find({ name: { $regex: text, $options: 'i' } }).toArray();
            res.send(result);
        })
        // post or insert toys from add a toy page
        app.post("/addAToy", async (req, res) => {
            const singleToy = req.body;
            const result = await toyCollection.insertOne(singleToy)
            res.send(result);
        })
        // post or insert toys from add a toy page
        app.post("/addABlog", async (req, res) => {
            const singleToy = req.body;
            const result = await blogCollection.insertOne(singleToy)
            res.send(result);
        })

        // all blog show
        app.get('/allBlog', async (req, res) => {
            const result = await blogCollection.find({}).toArray();
            res.send(result)
        })
        // delete one data
        app.delete('/deleteToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result)
        })

        // update data api here
        app.put('/updateToyInfo/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const data = req.body;
            const updatedDoc = {
                $set: {
                    price: data.price,
                    quantity: data.quantity,
                    description: data.description
                }
            }
            const result = await toyCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// app listening here
app.listen(port, () => {
    console.log(`Toy Galaxy is running on port: ${port}`);
})