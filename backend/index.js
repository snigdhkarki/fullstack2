var express = require('express');
const mongoose = require('mongoose');
var handleErrors = require('./handleerror');
var cors = require('cors');
var User = require('./user');
const cookieParser = require('cookie-parser');
var createToken = require('./createToken');
var jwt = require('jsonwebtoken');
const http = require('http');
const socketio = require('socket.io');

//make server
var app = express();
var app2 = express();
const server = http.createServer(app2);      //for chat 
const io = require("socket.io")(server, { origin: ":" });

app.listen(9000);

const messages = [];
server.listen(4000, () => {
    console.log('listening on *:4000');
  });
io.on('connection', (socket) => {
    console.log('a user connected');
  
    
    socket.emit('previous messages', messages);  //to broadcast messages to the client that was connected
  
    socket.on('chat message', (msg) => {
      
      console.log('message: ' + msg);
      messages.push(msg);
      io.emit('chat message', msg);    //to broadcast msg to all the clients 
      
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

// database connection
const dbURI = 'mongodb+srv://snigdh:snigdh@todo.glg9bkz.mongodb.net/fullstack';
mongoose.connect(dbURI);

//use

app.use(express.json());
app.use(cors({credentials: true, origin: 'https://2973-103-174-84-61.au.ngrok.io'}));
app.use(cookieParser());


//routing
app.get('/', function(req, res){
    res.send('lol why u here');
});

app.post('/signup', async function(req, res){
    const maxAge = 3*24*60*60;
    const {email, password} = req.body;
    try {
    const user = await User.create({email, password});
    const token = createToken(user._id);    
    res.cookie('jwt', token, { maxAge:maxAge*1000}); 
    res.status(201).json({user:user._id});   

}   catch(err){
    const errors = handleErrors(err);
    res.status(400).json({errors});
}
})
app.post('/login', async function(req, res){
    const maxAge = 3*24*60*60;
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxAge*1000});
        res.status(201).json({user:user._id});         
        }
        catch(err){
            errors = {email: '', password: 'Not valid'}
            res.status(400).json({errors:errors});
        }
})
app.get('/logout', (req, res)=>{    
    res.cookie('jwt', '', {maxAge:1});
    res.send('logout'); 
})
app.get('/checkUser',(req, res) =>{
    const token = req.cookies.jwt;
    if (token){
    jwt.verify(token, 'snigdh karki secret', async (err, decodedToken)=>{
        if (err){
            console.log(err.message);
            res.status(201).json({user:''});
            

        }else{
            
            let user = await User.findById(decodedToken.id);
            console.log(user);
            res.status(201).json({user:user});
            
        }
        });
        }else{
            res.status(201).json({user:''});

        }
})

