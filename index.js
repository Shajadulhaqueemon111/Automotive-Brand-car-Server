// Automotive
// KtNTK2TT7dhfJC44
const express=require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config()
const app=express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

// console.log(process.env.USER_NAME)
// console.log(process.env.USER_PASS)

const uri =`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.7auoehb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    const cartCollection=client.db("cartBd").collection('cart')
    const brandCollection=client.db("brandBD").collection("brand")
    await client.connect();
    // Send a ping to confirm a successful connection
   
// cart ar data
    
// app.get('/carts/:email',async(req,res)=>{
//   const emailAdder=req.params.email;
//   const cursor=cartCollection.find({email:emailAdder});
//   const result=await cursor.toArray()
 
//   res.send(result)
// })

app.get('/cart',async(req,res)=>{
  const cursor=cartCollection.find();
  const result=await cursor.toArray()
  res.send(result)
})

// awat CartCollection.find({email:req.params.email}).toArray()

// app.get('/cart',async(req,res)=>{
//   const id=req.params.id
//   const query={_id:new ObjectId(id)}//problem

//   const result=await cartCollection.findOne(query)
//   res.send(result)
// })



app.delete('/cart/:id',async(req,res)=>{
  const id=req.params.id;

  const query={_id:new ObjectId(id)}
  const result=await cartCollection.deleteOne(query)
  res.send(result)
})


app.post('/cart',async(req,res)=>{
  const {_id,...user}=req.body;
 
  const result=await cartCollection.insertOne(user)
  res.send(result)
  
})

// app.get('/cart/:id',async(req,res)=>{
//   const id=req.params.id
//   console.log(id)
//   const query={_id:new ObjectId(id)}

//   const result=await cartCollection.findOne(query)
//   res.send(result)
//   console.log(resu)
// })


// user ar data
    app.get('/users',async(req,res)=>{
        const cursor=brandCollection.find();
        const result=await cursor.toArray()
        res.send(result)
    })

    app.get('/users/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}

        const result=await brandCollection.findOne(query)
        res.send(result)
    })

    app.get('/user/:brand_name',async(req,res)=>{

        const BrandName=req.params.brand_name
        const smallBrand=BrandName.toLowerCase();
        console.log(smallBrand)
        const query={brand_name:smallBrand}
        const result=await brandCollection.find(query).toArray()
        
        res.send(result)

        console.log(result)
    })
   
  

// Other server setup and middleware


    app.post('/users',async(req,res)=>{
        const user=req.body;
        console.log(user);
        const result=await brandCollection.insertOne(user)
        res.send(result)
    })

    // hitting the specific brand name of the database side
    app.post("/user", async (req, res) => {
        try {
          const products = req.body; // This contains the brand_name sent from the frontend
          console.log("Received brand name:", products);
      
          // Use the brand_name to query your MongoDB collection
          const query = { brand_name: products.brand_name};
          const cursor = brandCollection.find(query);
          const result = await cursor.toArray();
      
          if (result.length > 0) {
            // Products matching the brand_name were found
            res.send(result);
          } else {
            // No products found for the specified brand_name
            res.send({ message: "No products found for the specified brand." });
          }
        } catch (error) {
          console.error("Error querying the database:", error);
          res.status(500).send("Internal Server Error");
        }
      });
  
  

    app.put('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)}
        const options={upsert:true}
        const updateCar=req.body
        const Car={

            $set:{
                 name:updateCar.name,
                  brand_name:updateCar.brand_name,
                  price:updateCar.price,
                  rating:updateCar.rating,
                  details:updateCar.details,
                  photo:updateCar.photo

            }
        }

        const result=await brandCollection.updateOne(filter,Car,options)
        res.send(result)
    })

  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hitting the Mongodb')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
