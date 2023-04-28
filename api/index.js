const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleWare = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345weqw345werjktjwertkj'

app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
        //jwt.sign 함수를 호출할 때, _id 값을 토큰에 포함
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
});

app.post('/post', uploadMiddleWare.single('file'), async(req, res) => {
  const {originalname, path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const {title, summary, content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
  
});

app.put('/post', uploadMiddleWare.single('file') ,async(req, res) => {
  let newPath = null;
  if(req.file){
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const {id, title, summary, content} = req.body;
    const postDoc = await Post.findById(id);
    //JSON.stringify() 자바스크립트 객체나 배열을 JSON 문자열로 변환하는 메소드
    const isAutor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAutor) {
      //400 에러는 클라이언트 측에서 서버에 잘못된 요청을 보낸 경우 발생하는 HTTP 상태 코드
      return res.status(400).json('작성자가 아닙니다.');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

//populate는 MongoDB에서 제공하는 기능으로, 데이터를 검색할 때 참조하는 다른 컬렉션의 데이터를 함께 가져올 수 있도록 해준다.
//결과적으로 모든 게시글 데이터를 가져오면서 해당 게시글 작성자의 정보도 함께 가져와서 JSON 형태로 반환하는 기능을 수행
app.get('/post', async (req, res) => {
  res.json(await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

app.listen(4000);
//mongodb+srv://blog:ioQLSIS3WWYiq88G@cluster0.xykqfoh.mongodb.net/?retryWrites=true&w=majority
//ioQLSIS3WWYiq88G