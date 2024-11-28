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

const DAILY_API_KEY = 'c05ef2783ddb563f9130765177d391c31a89e811c577899a87107af7449709f3';

app.post('/create-room', async (req, res) => {
    try {
        const roomName = req.body.name || 'defaultRoomName'; //name of the room given by daily
        const response = await axios.post(
            'https://teachingapplication.daily.co/testingRooms',
            {
                name: roomName, // Room name to be created
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
        res.json(response.data); // Returncreated room details
    } catch (error) {
        console.error('Error creating room:', error.response?.data || error.message);
        res.status(500).send('Failed to create room');
    }
});



//login system

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'))

app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'login.html')); // Adjust the filename if needed
});

app.get('/app', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

const userData=require('./models/users.js') //import in
const { addNewUser } = require('./models/users.js');

app.get('/register', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'register.html'))
})

app.post('/register',(request,response)=>{
    let givenUsername=request.body.username //recieve from form
    let givenPassword=request.body.password

    if(userData.addNewUser(givenUsername, givenPassword)){
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
   let givenUsername=request.body.username //recieve from form
   let givenPassword=request.body.password
   if(userData.checkPassword(givenUsername, givenPassword)){
    
    console.log('these mathc')
    response.redirect('/home');
    //response.send('login work')
    

   } else{
    console.log('wrong')
    response.send('invalid')
   }
    
})

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