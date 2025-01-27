const express = require('express');
const app = express();

const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');
const WebSocket = require('ws')
const http = require('http');


app.use(express.static('public')) 
 // Use the same HTTP server
//taken from ws Documentation

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Use the same HTTP server

const PORT = process.env.PORT || 3000;
wss.on('connection', (ws) => {
  console.log('A user connected');
  
  // Send a JSON string to the client
  ws.send(JSON.stringify({ username: 'Server', message: 'Server says Hi!' }));

  // Listen for incoming messages and broadcast 
  ws.on('message', (message) => {
    console.log('Received message:', message);

    // Ensure the message is a string 
    let messageString = message;
    try {
      
      if (typeof message !== 'string') {
        messageString = message.toString();
      }
      
      // Now we ensure it's JSON format
      const parsedMessage = JSON.parse(messageString);
      console.log('Parsed message:', parsedMessage);

      // Broadcast the parsed message to all other connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage)); // Ensure message is stringified before sending
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


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

require('dotenv').config() //require env 

let myPassword= process.env.MY_SECRET_PASSWORD //geting secret password from env file
console.log(myPassword)//env work

const mongoPassword=process.env.MONGODB_PASSWORD

const mongoose=require('mongoose')
const myDataBaseName= 'blogHarry'
const connecttionString=`mongodb+srv://CCO6005-00:${mongoPassword}@cluster0.lpfnqqx.mongodb.net/${myDataBaseName}?retryWrites=true&w=majority` //connect to the mongo databas dynamicly adding password and name 
mongoose.connect(connecttionString)



app.use(express.static('public')) //accsessing the public server to reach the home.html file

app.use(express.urlencoded({extended:false})) //parsig data


app.get('/app', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

const userData=require('./models/users.js')  //require the users.js file in order to run
const { addNewUser } = require('./models/users.js');

app.get('/register', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'register.html'))
})

app.post('/register',async (request,response)=>{ //recieving the data when user creates an account
    let givenUsername=request.body.username 
    let givenPassword=request.body.password

    if(await userData.addNewUser(givenUsername, givenPassword)){ //registers the new user localy
        console.log('registration sucsessful')
        response.redirect('/login');
    }else{
        console.log('failed')
    }
})


app.get('/login', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'login.html'))
})


app.post('/login', async (request, response)=>{
   let givenUsername=request.body.username 
   let givenPassword=request.body.password
   if(await userData.checkPassword(givenUsername, givenPassword)){
    console.log('these mathc')
    request.session.username=givenUsername

    response.redirect('/home'); //teslls the user login works and directs them back to the home page
    
   } else{
    console.log('wrong')
    request.session.destroy()
    response.send('invalid')
   }
    
})

app.set('view engine', 'ejs')

//sending the user to certein views throughout the login section
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');  // /index.html'
});

app.get('/logOut', (request,response)=>{
    response.sendFile(path.join(__dirname, '/vienws', 'logOut.html'))
})

app.post('/', (request,response)=>{
    response.sendFile(path.join(__dirname, '/views', 'login.html'))
    guest.session.destroy()
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




app.get('/resourceStorage', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '/views' ,'resourceStorage.html')); // connecting to the login page when localhost is loaded
});

app.get('/calender', checkLoggedIn, (request, response)=>{
    response.sendFile(path.join (__dirname, '/views', 'calender.html') )
})

app.get('/toDo', checkLoggedIn, (request, response)=>{
    response.sendFile(path.join (__dirname, '/views', 'toDo.html') )
})





// //form to handle data from lesson planner and send back the data const userData = require('./users.js'); 
app.get('/addLessonPlan', async (req, res) => {

      try {
     const user = await userData.findOne({ username: username });
       console.log({username})
  
       if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
   res.status(200).json({
       lessonName: user.userLessonPlan.lessonName,
        lessonDate: user.userLessonPlan.lessonDate,
        lessonDetails: user.userLessonPlan.lessonDetails
      });
    } catch (err) {
      console.error('Error retrieving lesson plan:', err);
     res.status(500).json({ message: 'Error retrieving lesson plan data' });
         }
   });





  app.post('/addLessonPlan', async (req, res) => {
  const { lessonName, lessonDate, lessonDetails } = req.body;
  const username=req.session.username
  // Validate that all fields are present
  if ( !lessonName || !lessonDate || !lessonDetails) {
    return res.status(400).json({ error: 'All fields (username, lessonName, lessonDate, lessonDetails) are required' });
  }

  try {
    // Call the function to add the new lesson plan
     console.log(">>"+req.session.username)
    await userData.addNewPlan(username, lessonName, lessonDate, lessonDetails);
    res.json({ message: 'Lesson plan added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add lesson plan' });
  }
});


const rooms = {}; 

// Store rooms and their users

// Endpoint to create a room
app.post('/create-room', (req, res) => {
    const roomKey = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a room key
    console.log('Room code:', roomKey);
    rooms[roomKey] = { users: [] };
    res.json({ roomKey }); // Use "roomKey" here (case-sensitive, matches frontend)
});

// Endpoint to join a room
app.post('/join-room', (req, res) => {
    const { roomKey, username } = req.body;

    if (!rooms[roomKey]) {
        return res.status(404).json({ message: 'Room not found' });
    }

    rooms[roomKey].users.push(username);
    res.json({ message: 'Room joined', users: rooms[roomKey].users });
});

// Endpoint to get room details
app.get('/room/:roomKey', (req, res) => {
    const { roomKey } = req.params;

    if (!rooms[roomKey]) {
        return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ users: rooms[roomKey].users });
});

app.get('/getLessonPlans', async (req, res) => {
  const username = req.session.username; // Getting the username from session

  if (!username) {
    return res.status(400).json({ message: 'User not logged in' });
  }

  try {
    // Find the user in the database by their username
    //const user = await userData.findOne({ username: username });
    const user= await userData.checkUser(req.session.username)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const lessonPlans = user.userLessonPlan;
    // res.json({lessonPlans:lessonPlans})

    // Send back the user's lesson plan data
    res.status(200).json(lessonPlans);
  } catch (err) {
    console.error('Error retrieving lesson plan data:', err);  
    res.status(500).json({ message: 'Error retrieving lesson plan data' });
  }
});

app.post('/addLessonPlan', async (req, res) => { //FOR LOOP ON FRONT END TO RUN THROUGH, ITS STORED IN OBJECTS AND THEN ARRAYS WITHIN THE OBJECT
  const { lessonName, lessonDate, lessonDetails } = req.body;
  const username = req.session.username;
  
  // Validate that all fields are present
  if (!lessonName || !lessonDate || !lessonDetails) {
    return res.status(400).json({ error: 'All fields (lessonName, lessonDate, lessonDetails) are required' });
  }

  try {
    
    const updatedUser = await userData.findOneAndUpdate(
      { username: username },
      { $push: { userLessonPlan: { lessonName, lessonDate, lessonDetails } } },
      { new: true } // return the updated document
    );

    res.status(200).json(updatedUser.userLessonPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add lesson plan' });
  }
});
//daily api
//daily documentation used

const createDailyRoom = async () => {
  const DAILY_API_URL = '';
  
  try {
    const response = await axios.post(
      DAILY_API_URL,
      {
        name: `room-${Date.now("https://teachingapplication.daily.co/theLearningLabs")}`, // Unique room name
        properties: {
          enable_chat: true,
          start_audio_off: true,
          start_video_off: true,
          max_participants: 10,
          exp: Math.floor(Date.now() / 1000) + 3600, // Room expires in 1 hour
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data; // Contains room URL, name, and other properties
  } catch (error) {
    console.error('Error creating room:', error.response.data);
    throw error;
  }
};
app.post('/api/create-room', async (req, res) => {
  try {
    const room = await createDailyRoom();
    res.status(200).json(room); // Send room data to the client
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});





// Endpoint to create a new scheduled event (meeting)



app.get('/getCalendlyData', (req, res) => {
    axios({
        method: 'get',
        url: 'https://v1.nocodeapi.com/harrycummins/calendly/PqbwrYTLbBOAuksw',
        params: {}
    })
    .then(function (response) {
        // Send the Calendly data to the frontend
        res.json(response.data);
    })
    .catch(function (error) {
        res.status(500).json({ error: 'Failed to fetch Calendly data' });
    });
});
