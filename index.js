const express = require('express')
const app = express()
const port  = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware 
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    await client.connect();
    // Send a ping to confirm a successful connection

    const coffeeCollection = client.db('coffeeDb').collection('coffee');

    app.get('/coffee', async(req, res)=>{
         const cursor =coffeeCollection.find()
         const result  = await cursor.toArray()
         res.send(result);
    })

    app.get('/coffee/:id', async(req, res)=>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await coffeeCollection.deleteOne(query)
       res.send(result);
    })

    app.post('/coffee',async(req,res)=>{

         const NewCoffee = req.body;
         console.log(NewCoffee);
         const result = await coffeeCollection.insertOne(NewCoffee);
         res.send(result);
    })

    app.delete('/coffee/:id', async(req, res)=>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await coffeeCollection.deleteOne(query);
       res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send("Coffee Server is Running ")
})

app.listen(port,()=>{
    console.log(`Server is Runninf on Port : ${port}`);
})