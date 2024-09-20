const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
/**
 * Mongodb Nodejs driver
 */
const uri = 'mongodb+srv://honaws24:AyrYvOSLX3PY7yiE@honcluster1.eavgv.mongodb.net/ejs1?retryWrites=true&w=majority';

const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.post('/users',(req,res)=>{

   const { username,email,password } = req.body;

   // Process the data (e.g., store it in a database)
   // Send back the received data as a JSON response
   res.json({
     username,email,password
   });
})
app.get('/', (req, res) => {   
    // Render index.ejs and pass the user object
    res.render('index');
});
app.get('/register',(req,res)=>{
   res.render('register')
})
app.get('/login',(req,res)=>{
   res.render('login')
})
client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
  } else {
    console.log('Connected to MongoDB');
    const db = client.db('ejs1');
    // You can now perform CRUD operations with 'db'
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
