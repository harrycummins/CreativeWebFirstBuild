const express = require('express');
const app = express();
const PORT=3000
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');
const { OpenAI } = require('openai');
const io = require('socket.io')
const WebSocket = require('ws')


 
app.listen(PORT, ()=>{
  console.log('listening on port for HTTP',PORT)
})

const wss = new WebSocket.Server({ port: 8011 }, () => {
  console.log('Listening on port for WS', 8011);
});

app.use(express.static('public')) 

//   connection is received
wss.on('connection', ws => {
  console.log((new Date()) + " Connection opened");

  ws.send(JSON.stringify('Server says Hi!'));

  
  ws.on('message', message => {
    console.log('Received message:', message);

    let msg = JSON.parse(message);
    

    if (msg.message && msg.message.trim()) {
      let msgJ = JSON.stringify(msg);  
      console.log('Broadcasting message:', msgJ);

      // Send the message to other client
      wss.clients.forEach(client => {
      
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msgJ);
        }
      });
    }
  });

  ws.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Client disconnected.');
  });
});








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

require('dotenv').config() //require env 

let myPassword= process.env.MY_SECRET_PASSWORD //geting secret password from env file
console.log(myPassword)//env work

const mongoPassword=process.env.MONGODB_PASSWORD

const mongoose=require('mongoose')
const myDataBaseName= 'blogHarry'
const connecttionString=`mongodb+srv://CCO6005-00:${mongoPassword}@cluster0.lpfnqqx.mongodb.net/${myDataBaseName}?retryWrites=true&w=majority` //connect to the mongo databas dynamicly adding password and name 
mongoose.connect(connecttionString)



//accsessing the public server to reach the home.html file

app.use(express.urlencoded({extended:false})) //parsig data

// //app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/views', 'login.html')); // connecting to the login page when localhost is loaded
// });

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');  // Assuming the landing page is in 'public/index.html'
});

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

app.get('/calls',  (request, response) => {
    response.sendFile(path.join(__dirname, '/views', 'ratings.html'))
}) //cehck user logged in


//teachres pages

app.get('/resourceStorage', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '/views' ,'resourceStorage.html')); // connecting to the login page when localhost is loaded
});

app.get('/calender', checkLoggedIn, (request, response)=>{
    response.sendFile(path.join (__dirname, '/views', 'calender.html') )
})

app.get('/toDo', checkLoggedIn, (request, response)=>{
    response.sendFile(path.join (__dirname, '/views', 'toDo.html') )
})


// app.get('/getUsername', (req, res) => {
//   const username = 'test';  // Replace with actual username logic (from session, DB, etc.)
//   res.json({ username: username });
// });


// //form to handle data from lesson planner and send back the data const userData = require('./users.js'); 
app.get('/addLessonPlan', async (req, res) => {
  const username=req.session.username
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
    console.log(">>"+req.session.username)

    // Call the function to add the new lesson plan
    await userData.addNewPlan(username, lessonName, lessonDate, lessonDetails);
    res.json({ message: 'Lesson plan added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add lesson plan' });
  }
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

    // Assuming 'userLessonPlan' is an array, or modify if it's just one lesson
    const lessonPlans = user.userLessonPlan;
    // res.json({lessonPlans:lessonPlans})

    // Send back the user's lesson plan data
    res.status(200).json(lessonPlans);
  } catch (err) {
    console.error('Error retrieving lesson plan data:', err);  // Log the error
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


// app.get('/getLessonPlans', async (req, res) => {
//   try {
//     const lessonData = await userData.getLessonData(5);  // Assuming this method exists
//     res.json({ users: lessonData });
//   } catch (error) {
//     console.error('Error fetching lesson data:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
// app.post('/newLessonPost',(request, response)=>{
//   console.log(request.body)
//   const username=req.session.username
//   getLessonData.addNewPost(request.session.username, request.body.lessonDate, request.body.lessonName)
//   response.sendFile(path.join(__dirname, './views','resourceStorage.html'))
// })
//google calender

// )
//   })

//   app
// /const postData=require('/models/lessonPlan.js')
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,        // Loaded from the .env file
    process.env.SECRET_ID,    // Loaded from the .env file
    process.env.REDIRECT      // Loaded from the .env file
  );
  
  // Redirect user to Google for authentication
  app.get('/toGoogle', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
    });
    res.redirect(url);
  });
  
  // Handle redirect after user grants permission
  app.get('/redirect', (req, res) => {
    const code = req.query.code;
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        console.error('Cannot get token', err);
        res.send('Error');
        return;
      }
      oauth2Client.setCredentials(tokens);
      res.send('Logged in');
    });
  });
  
  // Fetch calendar list
  app.get('/calendars', (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    calendar.calendarList.list({}, (err, response) => {
      if (err) {
        console.error('Error fetching calendars', err);
        res.end('Error!');
        return;
      }
      const calendars = response.data.items;
      res.json(calendars);
    });
  });
  
  // Fetch events from a calendar
  app.get('/events', (req, res) => {
    const calendarId = req.query.calendar || 'primary';
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    calendar.events.list({
      calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 15,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, response) => {
      if (err) {
        console.error('Error fetching events', err);
        res.send('Error');
        return;
      }
      const events = response.data.items;
      res.json(events);
    });
  });
  
  //randomisier
  
  const rooms = {}; // MongoDB will be added when needed, is being stored localy for now
   
  app.post('/create-room', (req, res) => { //creates the room when button is pressed
      const roomKey = Math.random().toString(36).substring(2, 8).toUpperCase(); // randomises a code to include numbers, lowercase and uppercase numbers
      console.log('room code',roomKey) 
      rooms[roomKey] = { users: [] };
      res.json({ roomkey:roomKey }); //return json data to the frontend
  });
  
  app.post('/join-room', (req, res) => { 
      const { roomKey, username } = req.body;
  
  app.get('roomKey', (req, res) => {
      const { roomKey } = req.params; //checks to see room key matches
  
      if (!rooms[roomKey]) {
          return res.json({ message: 'Room not found' }); //if not returns not found message
      }
      res.json({ users: rooms[roomKey].users });
  });
      if (!rooms[roomKey]) {
          return res.status(404).send('Room not found');
      }
  
      rooms[roomKey].users.push(username);
      res.json({ message: 'Room joined', users: rooms[roomKey].users });
  });

 app.get('chatMessage', (req,res)=> {
    
 })


 //chatbot using open AI
 //exceeded current quota?
 

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const completion = openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   store: true,
//   messages: [
//     {"role": "user", "content": "write a haiku about ai"},
//   ],
// });

// app.post('/chat', async (req, res) => {
//   const { userMessage } = req.body; // Get message from the user (teacher)

//   try {
//     // Request a completion from the GPT model
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4', // You can also use gpt-3.5-turbo or gpt-4
//       messages: [
//         { role: 'system', content: 'You are a helpful assistant for teachers.' },
//         { role: 'user', content: userMessage },
//       ],
//     });

//     // Send the response back to the client
//     res.json({ message: response.choices[0].message.content });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Something went wrong!');
//   }
// });
// Assuming you have the correct import for userData (your User model)

// Route to fetch lesson plans for a specific teacher
// Endpoint to fetch teacher's lesson plan
app.get('/ratingsPlan/:teachersUsername', async (req, res) => {
  try {
    // Extract the teacher's username from the URL
    const teachersUsername = req.params.teachersUsername;
    
    // Find the teacher by their username
    const teacher = await userData.findOne({ username: teachersUsername });

    // Log the teacher data (optional for debugging)
    console.log({ teacher });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Respond with the teacher's lesson plan data
    res.json({
      lessonName: teacher.userLessonPlan.lessonName,
      lessonDate: teacher.userLessonPlan.lessonDate,
      lessonDetails: teacher.userLessonPlan.lessonDetails,
      lessonRatings: teacher.userLessonPlan.lessonRatings,
    });
  } catch (err) {
    console.error('Error fetching lesson plans:', err);
    res.status(500).json({ message: 'Error fetching lesson plans' });
  }
});

