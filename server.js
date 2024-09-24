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

// app.get('/products',(req,res)=>{
//    res.render('homeProducts')
// })

async function connectToMongoDB() {
  try {
      await client.connect();
      console.log('Connected to MongoDB');
      const db = client.db('ejs1');
      const usersCollection = db.collection('Users');
      const productsCollection =db.collection('Products')
      
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      // await usersCollection.createIndex({ username: 1 }, { unique: true });
     
      app.post('/admin/users', async (req, res) => {
         const { username, email, password } = req.body;
         const hashedPassword = await bcrypt.hash(password, 10);
         
         try {             
            const result = await usersCollection.insertOne({ 
               username, email, 
               password: hashedPassword,
               role: 0 });
            
             /**testing */
            const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
            // console.log(`insertedUser::${insertedUser}`)              
            // if (insertedUser) {
               // console.log(`Inserted latest user's email: ${insertedUser.email}`);
            //} /** end testing */                       
            res.json({
                  success: true,
                  message: 'User registered successfully',
                  userId: result.insertedId,
                  username,
                  email,
                  password
              });
          } catch (err) {              
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
            
      try {
         const {email}= req.body
         console.log(`Request Body:`, req.body); // Debugging
         const update = {
            $set: {               
                email: email,                
            }
        };
        console.log(`Update Payload:`, update);

        console.log(`newEmail::${email}`)
        // testing
        const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
         console.log(`Existing User: ${existingUser}`);
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) }, 
            update,
            { returnDocument: 'after'  } 
        );
         console.log(`result.value::${result.value}`)

         if (result.value) {
            console.log(`Updated user: ${result.value}`);
            res.status(200).json({ message: "User updated successfully", user: result.value });
        } else {
            
            const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
            console.log(`Manually fetched updated user: ${updatedUser.value}`);
            
            if (updatedUser) {
                res.status(200).json({ message: "User updated successfully", user: updatedUser });
               } else {
                  res.status(404).json({ error: "User not found after update" });
              }
        } 
      } catch(error){
         res.status(500).json({error: "Server Error Updating user"})
      }
     })     
      //END ADMIN 
      //START PRODUCTS
      app.post('/admin/products',async(req,res)=>{
         const {name,category,price,dateArrival,photo} = req.body
         try {
            const newProduct = await productsCollection.insertOne({
               name,category,price,dateArrival,photo
            })

            let insertedProduct = await productsCollection.findOne({_id: newProduct.insertedId})
            if(insertedProduct){
               console.log(`New Product found with name ::${insertedProduct.name}`)
            } else {
               console.log(`No new product added`)
            }
            res.status(200).json({
               success: true,
               message: 'Product Addeded successfully',
               productId: newProduct.insertedId,
               name,dateArrival,price,photo
           });

         } catch (error){
            console.log(`Failed to retrieved products, ERRORS:: ${error}`)
            res.status(500).json({error:"Unable to add product"})
         }
      })
      app.get('/admin/products',async (req,res)=>{       
         try {
            const products = await db.productsCollection.find().toArray()
            res.render('admin/adminProducts',{products})
         } catch(error){
            console.log(`Failed to retrieved products backend`)
         }
        
      })
      
      //END PRODUCTS

  } catch (err) {
      console.error('Failed to connect to MongoDB', err);
  }
}
let PORT=3000

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
});
