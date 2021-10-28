const express = require ('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require ('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ww2yo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        const database = client.db('Vlunteer');
        const userCollection = database.collection('users');

        // Get Api
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            // console.log('users from', users);
            res.send(users)
        });

        // get specific api
        app.get('/users/:id', async(req, res) => {
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const user = await userCollection.findOne(query);
           console.log('load user id',user)
           res.send(user) 
        });

        // update api
        app.put('/users/:id', async(req, res) => {
            const id = req.params.id;
            const updateuser = req.body;
            const filter = {_id: ObjectId(id)};
            const option = { upsert: true};
            const updateDoc = {
               $set: {
                    name: updateuser.name,
                    text: updateuser.text
               }
            }
            const result = await userCollection.updateOne(filter, updateDoc, option)
            console.log('updating', result);
            res.json(result) 
        })

        // delete Api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
           console.log('delete user with id', result);
           res.json(result); 
           


        });

        // Post Api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            // console.log('user from', result);
            // console.log('post id', req.body);
            res.json(result);
        });
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('volunterr network express')
});

app.get('/hello', (req, res) => {
    res.send('hello updated')
});

app.listen(port, () => {
    console.log('volunteer are here', port)
});