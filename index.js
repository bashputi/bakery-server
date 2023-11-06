const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const cookieParser= require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// app.use(cors({
//     origin: ['http://localhost:5173'],
//   credentials: true,
// }));

// app.use(cookieParser());

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
   await client.connect();
    const bakeryCollection = client.db('bakeryDB').collection('bakery');
    
    // post all data in server 
    app.post('/bakery', async(req, res) => {
        try {
            const body = req.body;
            const result = await bakeryCollection.insertOne(body);
            res.send(result);
        } catch (error) {
            console.log(error)
        }
    });
    // get all data from server 
    app.get('/bakery', async(req, res) => {
        const result = await bakeryCollection.find().toArray();
        res.send(result);
    })
    // get single data 
    app.get('/bakery/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await bakeryCollection.findOne(query);
      res.send(result);
    })

    const orderCollection = client.db('bakeryDB').collection('order');
    // post order 
    app.post('/order', async(req, res) => {
      const user = req.body;
      const result = await orderCollection.insertOne(user);
      console.log(result)
      res.send(result);
    })

    app.get('/order', async(req, res) => {

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