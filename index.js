const express = require('express');
const app = express();
const PORT=3000
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

app.listen(PORT, ()=>{
    console.log('listening on port' + PORT)
})

//using the daily api to create a video room

//login system
//was following the same steps used within class tutorials

app.use(bodyParser.json());
app.use(cors());

const cookieParser=require('cookie-parser')
const sessions=require('express-session')

app.use(cookieParser())

const threeMinutes= 3 * 60 * 1000
const oneHour= 60 * 60 * 1000

app.use(sessions({
    secret:'secret ticket',
    cookie: {maxAge:threeMinutes},
    saveUninitialized: true,
    resave: false,
}))

function checkLoggedIn(request, response, nextAction){
    if(request.session){
        if(request.session.username){
            nextAction()
        }else {
            request.session.destroy()
            response.sendFile(path.join(__dirname, './views', 'login.html'))
        }
    }
}

require('dotenv').config()

let myPassword= process.env.MY_SECRET_PASSWORD
console.log(myPassword)//env work


app.use(express.static('public')) //accsessing the public server to reach the home.html file

app.use(express.urlencoded({extended:false})) //parsing data

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'login.html')); // connecting to the login page when localhost is loaded
});

app.get('/app', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

const userData=require('./models/users.js')  //require the users.js file in order to run
const { addNewUser } = require('./models/users.js');

app.get('/register', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'register.html'))
})

app.post('/register',(request,response)=>{ //recieving the data when user creates an account
    let givenUsername=request.body.username 
    let givenPassword=request.body.password

    if(userData.addNewUser(givenUsername, givenPassword)){ //registers the new user localy
        console.log('registration sucsessful')
        response.redirect('/login');
    }else{
        console.log('failed')
    }
})


app.get('/login', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'login.html'))
})


app.post('/login', (request, response)=>{
   let givenUsername=request.body.username 
   let givenPassword=request.body.password
   if(userData.checkPassword(givenUsername, givenPassword)){
    console.log('these mathc')
    request.session.username=givenUsername

    response.redirect('/home'); //teslls the user login works and directs them back to the home page
    
   } else{
    console.log('wrong')
    request.session.destroy()
    response.send('invalid')
   }
    
})


//sending the user to certein views throughout the login section

app.get('/logOut', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'logOut.html'))
})

app.post('/logOut', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'login.html'))
    equest.session.destroy()
})

app.get('/back', (request,response)=>{
    response.sendFile(path.join(__dirname, '/public', 'home.html'))
})

app.get('/home', (request, response) => {
    response.sendFile(path.join(__dirname, '/public', 'home.html'));  // Serve home.html from the public folder
});

app.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname, '/views', 'login.html'));
});

app.get('/roomJoin', (request, response) => {
    response.sendFile(path.join(__dirname, '/testingRooms', 'roomJoin.html'))
})

app.get('/calls', checkLoggedIn, (request, response) => {
    response.sendFile(path.join(__dirname, '/views', 'calls.html'))
}) //cehck user logged in


