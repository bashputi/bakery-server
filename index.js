const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5176',
  'http://localhost:5173'],
credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fobkzbd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const verifyToken = async(req, res, next) => {
//   const token = req.cookies?.token;
//   console.log(token)
//   if(!token){
//     return res.status(401).send({message: 'Unauthorized access'})
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decorded) => {
//     if(err){
//       return res.status(401).send({message: 'unauthorized'})
//     }
//     console.log(decorded);
//     req.user = decorded;
//     next()
//   })
// };


// middlewear
// const logger = async(req, res, next) => {
//   const hostname = req.hostname;
//   console.log('called:', hostname, req.originalUrl);
//   next()
// }

async function run() {
  try {
  //  await client.connect();
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

    app.post('jwt', async(req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1h'});
        res.cookie('token', token, {
          httpOnly: true,
          secure: false
        })
        .send({success: true});
    })
    app.post('/logout', async(req, res) => {
      const user = req.body;
    console.log(user);
      res.clearCookie('token', {maxAge: 0}.send({success: true}))
    })
    // get all data from server 
    app.get('/bakery',  async(req, res) => {
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
    // page count 
    app.get('/bakery', async(req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
        const result = await bakeryCollection.find()
        .skip(page * size)
        .limit(size)
        .toArray();
        res.send(result);
    })

    app.post('/productByIds', async(req, res) => {
      const ids = req.body;
      const idsWithObjectId = ids.map(id => new ObjectId(id))
      const query = {
        _id: {
          $in: idsWithObjectId
        }
      }
      const result = await bakeryCollection.find(query).toArray
      res.send(result)
    })
    app.get('/bakery', async(req, res) => {
      const count = await bakeryCollection.estimatedDocumentCount();
      res.send({count});
    })
   
    const orderCollection = client.db('bakeryDB').collection('order');
    // post order 
    app.post('/order', async(req, res) => {
      const user = req.body;
      const result = await orderCollection.insertOne(user);
      res.send(result);
    })

    app.get('/order', async(req, res) => {
      const cursor = await orderCollection.find().toArray();
      res.send(cursor);
    })
    // app.get('/order/:id', async(req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id)};
    //   const result = await orderCollection.findOne(query);
    //   res.send(result);
    // })

  // app.get('/order', verifyToken, async(req, res) => {
  //   console.log(req.query.email);
  //   if(req.query.email !== req.user.email){
  //     return res.status(403).send({message: 'forbidden access'})
  //   }
  //   let query = {};
  //   if (req.query?.email) {
  //     query = { email: req.query.email }
  //    }
  //   const result = await orderCollection.find(query).toArray();
  //   res.send(result);
  // })

  app.delete('/order/:id', async(req, res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.send(result);
  })

  app.patch('/order/:id', async(req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedorder = req.body;
    console.log(updatedorder);
    const updateDoc = {
      $set: {
        status: updatedorder.status
      }
    };
    const result = await orderCollection.updateOne(filter, updateDoc);
    res.send(result);
  })
  // my item 
  const myCollection = client.db('bakeryDB').collection('item');

  app.post('/item', async(req, res) => {
    const user = req.body;
    const result = await myCollection.insertOne(user);
    res.send(result);
  })

  app.get('/item', async(req, res) => {
    const cursor = await myCollection.find().toArray();
    res.send(cursor);
  })
  // app.get('/item',  verifyToken, async(req, res) => {
  //   console.log(req.query.email);
  //   if(req.query.email !== req.user.email){
  //     return res.status(403).send({message: 'forbidden access'})
  //   }
  //   let query = {};
  //   if (req.query?.email) {
  //     query = { email: req.query.email }
  //    }
  //   const result = await myCollection.find(query).toArray();
  //   res.send(result);
  // })
  app.get('/item/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await myCollection.findOne(query);
    res.send(result);
  })
  app.delete('/item/:id', async(req, res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await myCollection.deleteOne(query);
    res.send(result);
  })
  app.put('/item/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = { upsert: true };
    const updatedItem = req.body;
    const item ={
      $set: {
        foodname: updatedItem.foodName,
        img: updatedItem.pic,
        quantity: updatedItem.quantity,
        price: updatedItem.price,
        customerName: updatedItem.name,
        email: updatedItem.email,
        origin: updatedItem.origin,
        recipie: updatedItem.recipie
      }
    };
    const result = await myCollection.updateOne(filter, item, options);
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