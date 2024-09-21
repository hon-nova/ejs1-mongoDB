const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

/**
 * Mongodb Nodejs driver
 */
const uri='mongodb+srv://honaws24:AyrYvOSLX3PY7yiE@honcluster1.eavgv.mongodb.net/?retryWrites=true&w=majority&appName=HonCluster1'

const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);

// Set the view engine to EJS
app.use(cors());
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

     
      app.post('/admin/users', async (req, res) => {
         const { username, email, password } = req.body;
         const hashedPassword = await bcrypt.hash(password, 10);
         
         try {
              // Insert the user into the 'Users' collection
            const result = await usersCollection.insertOne({ 
               username, email, 
               password: hashedPassword,
               role: 0 });
            console.log(`User added with ID: ${result.insertedId}`);  
            //testing

            // Fetch the inserted user document by its ID
            const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
            console.log(`insertedUser::${insertedUser}`)

            if (insertedUser) {
               console.log(`Inserted latest user's email: ${insertedUser.email}`);
            }
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
      app.post('/login', async(req,res)=>{
         //1 retrieve user
         try {

            const {email,password} = req.body

            const retrievedUser = await usersCollection.findOne({ email: email, });
         } catch(err){
            console.log(`LOGIn FAILED:: ${err}`)
         };
         //2 compare the user inputs and the db user
      })
      app.get('/admin/users', async (req, res) => {
        const users = await db.collection('Users').find().toArray();
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
