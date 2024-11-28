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

const DAILY_API_KEY = 'c05ef2783ddb563f9130765177d391c31a89e811c577899a87107af7449709f3'; //api key provided from daily

app.post('/create-room', async (req, res) => { //code was taken from a start up guide within the daily api website
    try {
        const roomName = req.body.name || 'defaultRoomName'; //name of the room given by daily - not loading correct
        const response = await axios.post(
            'https://teachingapplication.daily.co/testingRooms',
            {
                name: roomName, // Room name to be created //code taken from daily article
                properties: {
                    enable_chat: true,
                    enable_screenshare: true,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${c05ef2783ddb563f9130765177d391c31a89e811c577899a87107af7449709f3}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.json(response.data); // Return created room details
    } catch (error) {
        console.error('Error creating room:', error.response?.data || error.message);
        res.status(500).send('Failed to create room');
    }
});


//login system
//was following the same steps used within class tutorials

app.use(bodyParser.json());
app.use(cors());

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
    response.redirect('/home'); //teslls the user login works and directs them back to the home page
    
    

   } else{
    console.log('wrong')
    response.send('invalid')
   }
    
})


//sending the user to certein views throughout the login section

app.get('/logOut', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'logOut.html'))
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

app.get('/calls', (request, response) => {
    response.sendFile(path.join(__dirname, '/views', 'calls.html'))
})