const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
/**
 * Mongodb Nodejs driver
 */
const uri='mongodb+srv://honaws24:AyrYvOSLX3PY7yiE@honcluster1.eavgv.mongodb.net/?retryWrites=true&w=majority&appName=HonCluster1'

const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());


app.get('/register',(req,res)=>{
   res.render('register')
})
app.get('/login',(req,res)=>{
   res.render('login')
})
// Connect to MongoDB
async function connectToMongoDB() {
  try {
      await client.connect();
      console.log('Connected to MongoDB');
      const db = client.db('ejs1');
      const usersCollection = db.collection('Users');

      // POST request to add users to the MongoDB collection
      //ADMIN
      app.post('/users', async (req, res) => {
          const { username, email, password } = req.body;
         
          try {
              // Insert the user into the 'Users' collection
              const result = await usersCollection.insertOne({ username, email, password });
              console.log(`User added with ID: ${result.insertedId}`);

              console.log(`result backend::${result}`)
              // console.log(`username::${result.username}`)
              // Send back the received data as a JSON response
              res.json({
                  success: true,
                  message: 'User registered successfully',
                  userId: result.insertedId,
                  username,
                  email,
                  password
              });
          } catch (err) {
              console.error('Error inserting user into database', err);
              res.status(500).json({
                  success: false,
                  message: 'Failed to register user'
              });
          }
      });
      app.get('/admin/users', async (req, res) => {
        const users = await db.collection('Users').find().toArray();
        console.log(`ALL USERS BACKEND:: ${users[0].email}`)
        res.render('admin/adminUsers', { users });
      });
      app.post('/admin/users/delete/:id', async (req, res) => {
        const userId = req.params.id;
        await db.collection('users').deleteOne({ _id: userId });
        res.redirect('/admin/users');
      });
      
      
      //END ADMIN

      // Main index route
      app.get('/', (req, res) => {
          res.render('index');
      });

  } catch (err) {
      console.error('Failed to connect to MongoDB', err);
  }
}
let PORT=3000
// Start the server after connecting to MongoDB
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
});
