const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use(cors());


  const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '3699',
    database : 'login'
 });
  
 connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
 });


 

 const jwtSecret = 'your_jwt_secret';
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    connection.query('SELECT * FROM users WHERE user_name = ?', [username], (err, results) => {
      if (!results) {
        return res.status(400).json({ msg: 'User does not exist' });
      }
  else {
    const user = results;
console.log(user[0].password);
    bcrypt.compare(password, user[0].password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }
  else {
    jwt.sign(
        { id: user[0].id },
        jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user[0].id, username: user[0].user_name,role : user[0].role } });
        }
      );
  }
        
      });
  }
  
      
    });
  });

  const saltRounds = 10;

  app.post('/register',(req,res)=>{
    const { username,password,role} = req.body;

    bcrypt.hash(password,saltRounds, function(err,hash){
      if(err){
        console.log(err);
      }
      const hashedPassword = hash;
      connection.query('insert into users (user_name,password,role) values(?,?,?)',[username,hashedPassword,role],(err,results)=>{
        if(err) throw err;
        else {
          res.send('User registered successfully');
        }
      })
    })
    
  })

   const PORT = process.env.PORT || 3000;
   app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
   });