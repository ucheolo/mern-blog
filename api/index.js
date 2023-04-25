const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345weqw345werjktjwertkj'

app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://blog:ioQLSIS3WWYiq88G@cluster0.xykqfoh.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res)=>{
  const {username, password} = req.body;
  try{
    const userDoc = await User.create({
      username, 
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  }catch(e){
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if(passOk){
    //logged in
    jwt.sign({username, id:userDoc._id}, secret, {}, (err, token)=>{
      if(err) throw err;
      res.cookie('token',token).json({
        id:userDoc._id,
        username,
      });
    });
    //res.json();
  }else{
    res.status(400).json('비밀번호가 틀렸습니다.');
  }
});

app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  res.json(req.cookies);
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
  setUsername(null);
});

app.listen(4000);
//mongodb+srv://blog:ioQLSIS3WWYiq88G@cluster0.xykqfoh.mongodb.net/?retryWrites=true&w=majority
//ioQLSIS3WWYiq88G