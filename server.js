const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');


/**
 * Mongodb Nodejs driver
 */
const uri='mongodb+srv://honaws24:AyrYvOSLX3PY7yiE@honcluster1.eavgv.mongodb.net/?retryWrites=true&w=majority&appName=HonCluster1'

const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);

// Set the view engine to EJS
app.use(cors());
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views')); 
app.set('views','./views')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
   res.render('index')
})
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
      // Create unique indexes for email and username

      await usersCollection.createIndex({ email: 1 }, { unique: true });
      // await usersCollection.createIndex({ username: 1 }, { unique: true });
     
      app.post('/admin/users', async (req, res) => {
         const { username, email, password } = req.body;
         const hashedPassword = await bcrypt.hash(password, 10);
         
         try {
              // Insert the user into the 'Users' collection
            const result = await usersCollection.insertOne({ 
               username, email, 
               password: hashedPassword,
               role: 0 });
            // console.log(`User added with ID: ${result.insertedId}`);  
            //testing

             /**testing */
            const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
            // console.log(`insertedUser::${insertedUser}`)
              
            // if (insertedUser) {
               // console.log(`Inserted latest user's email: ${insertedUser.email}`);
            //} /** end testing */
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
              // Error code 11000 is for duplicate key errors in MongoDB
               if (err.code === 11000) {
                  const errorMessage = err.keyValue.email ? 
                  'Email already exists. Please choose a different email.' : 
                  'Username already exists. Please choose a different username.';
                  
                  return res.status(400).json({success: false,
                  message: errorMessage
                  });
               }
               console.error('Error registering user:', err);
               res.status(500).json({
                  success: false,
                  message: 'Failed to register user'
               });  
          }
      });
      
      // User Login
      app.post('/auth/login', async (req, res) => {

         const { email, password } = req.body; 
         try {
         const user = await usersCollection.findOne({ email });
         if (!user) {
            return res.status(400).json({ message: 'User Not Found!' });
         }
         /**testing */

         // console.log(`user email backend::${user.email}`)
      
         const match = await bcrypt.compare(password, user.password);
         if (!match) {
            return res.status(400).json({ message: 'Incorrect email or password.' });
         }      
         res.json({ message: 'Login successful!', user:user });
         // res.redirect('/');

         } catch (err) {
         res.status(500).json({ message: 'Error logging in.' });
         }
      });

      app.get('/admin/users', async (req, res) => {
         try {
            const users = await usersCollection.find().toArray();
            res.render('admin/adminUsers',{users})
         } catch(error){
            
         }
       
      });        
      app.get('/apijson/users', async(req,res)=>{
         try {
            const users = await usersCollection.find().toArray();
            res.status(200).json({users})
         } catch(error){
            console.error('Error fetching users:', error);
            res.status(500).send('Error fetching users');
         }
      })
      app.delete('/admin/users/:id', async (req, res) => {
         const userId = req.params.id;
         
         try {
             const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) }); // Ensure you're using the correct MongoDB ObjectId
     
             if (result.deletedCount === 0) {
                 res.status(404).json({ error: 'User Not Found' });
             } 
             res.status(200).json({message:'User deletedly successfully'})
         } catch (err) {
             res.status(500).json({ error: 'Server Error deleting user' });
         }
     });

     app.put('/admin/users/:id',async (req,res)=>{
      console.log( `backend update loaded`)
      const userId = req.params.id;
      console.log(`userId BACKEND::${userId}`)
      // Check if the provided ID is valid for MongoDB
      // if (!ObjectId.isValid(userId)) {
      //    console.log(`False userID`)
      //    return res.status(400).json({ error: "Invalid user ID" });
      // } else {
      //    console.log(`Valid userID`)
      // }
      try {
         const {email}=req.body
         const update = {
            $set: {               
                email: email,                
            }
        };

        // Find the user by ID and update it
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) }, // Filter by the user _id
            update, // The update operation
            { returnOriginal: false } // Option to return the updated document
        );
         // console.log(`stm update::${stm}`)
         if (result.value) {
            console.log(`Updated user: ${result.value}`);
            res.status(200).json({ message: "User updated successfully", user: result.value });
        } else {
            res.status(404).json({ error: "User not found" });
        }
         

      } catch(error){
         res.status(500).json({error: "Server Error Updating user"})
      }
     })
       
      
      //END ADMIN

      

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
