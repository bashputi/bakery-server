const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
    origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fobkzbd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});





async function run() {
  try {
//    await client.connect();
    const bakeryCollection = client.db('bakeryDB').collection('bakery');
    
    app.post('/bakery', async(req, res) => {
        try {
            const body = re.body;
            const result = await bakeryCollection.insertOne(body);
            res.send(result);
        } catch (error) {
            console.log(error)
        }
    });
    
    app.get('/bakery', async(req, res) => {
        const result = await bakeryCollection.find().toArray();
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('Bakery is running')
});
app.listen(port, () => {
    console.log(`SL Bakery is running on port ${port}`)
});