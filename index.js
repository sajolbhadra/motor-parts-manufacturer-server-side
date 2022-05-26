const express = require('express');
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
require('dotenv').config();


const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;


//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.60qwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        console.log('server online')
        const itemsCollection = client.db('motorpartsmanufacturer').collection('item');
        const ordersCollection = client.db('motorpartsmanufacturer').collection('order');
        const usersCollection = client.db('motorpartsmanufacturer').collection('user');
        const reviewsCollection = client.db('motorpartsmanufacturer').collection('review');


        //-------------------------------------Items----------------------------------
        //---------Insert an Item------------
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            console.log('new item added', newItem);
            const result = await itemsCollection.insertOne(newItem);
            // res.send({result : 'success'})
            res.send(result)
            console.log(result)
        });

        //---------Get all items----------
        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query)
            const items = await cursor.toArray();
            res.send(items);
        })

        //--- Get Individual Item Details-------------
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.findOne(query);
            res.send(result)
        })

        //-----Update Individual Item-----------
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateItem.quantity
                }
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
            console.log(result)
        })

        //--------Delete Individual Item---------------
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
            console.log(id, result)
        })





        //----------------------------Order------------------------------
        //-----Insert An Order


        //-------Get All Order

        //-----Update An order

        //-----Delete An Order



        //--------------------------------User--------------------------
        //filter user
        app.get('/order', async(req, res) => {
            const email = req.query.email;
            const query = {email:email};
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders)
        })



        
        //-----------------------------Review---------------------------
        //----insert review
        app.post('/review', async (req, res) => {
            const reviews = req.body;
            console.log('new item added', reviews);
            const result = await reviewsCollection.insertOne(reviews);
            // res.send({result : 'success'})
            res.send(result)
            console.log(result)
        });
        //------get all review
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query)
            const items = await cursor.toArray();
            res.send(items);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Online');
})

app.listen(port, () => {
    console.log('Server on port', port)
})