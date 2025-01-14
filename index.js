const express = require('express');
const app = express();
const PORT=3000
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');

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

app.get('/calls', checkLoggedIn, (request, response) => {
    response.sendFile(path.join(__dirname, '/views', 'calls.html'))
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





// //form to handle data from lesson planner and send back the data const userData = require('./users.js'); 
// // app.get('/addLessonPlan', async (req, res) => {

// //       try {
// //       const user = await userData.findOne({ username: username });
// //       console.log({username})
  
// //       if (!user) {
// //         return res.status(404).json({ message: 'User not found' });
// //       }
  
// //       res.status(200).json({
// //         lessonName: user.userLessonPlan.lessonName,
// //         lessonDate: user.userLessonPlan.lessonDate,
// //         lessonDetails: user.userLessonPlan.lessonDetails
// //       });
// //     } catch (err) {
// //       console.error('Error retrieving lesson plan:', err);
// //       res.status(500).json({ message: 'Error retrieving lesson plan data' });
// //     }
//   });


//   app.post('/addLessonPlan', async (req, res) => {
//     const { lessonName, lessonDate, lessonDetails, username } = req.body;
//     // Check if username exists in the session
   
//     try {
//       // Call the 'addNewPlan' function and pass the necessary parameters
//       await addNewPlan(username, lessonName, lessonDate, lessonDetails);
//       res.json({ message: 'Lesson plan added successfully' });
//     } catch (err) {
//       res.status(500).json({ error: 'Failed to add lesson plan' });
//     }
//   });



async function addNewPlan(username, lessonName, lessonDate, lessonDetails) {
    try {
      // Check if username exists in the database
      const user = await User.findOne({ username: username });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Update the user's document and push a new lesson plan
      await User.findOneAndUpdate(
        { username: username },
        {
          $push: {
            lessonPlans: {   // Assuming 'lessonPlans' is an array in your User schema
              lessonName: lessonName,
              lessonDate: new Date(lessonDate),
              lessonDetails: lessonDetails
            }
          }
        },
        { new: true } // Return the updated document
      );
  
      console.log('Lesson plan added successfully');
    } catch (err) {
      console.error("Error: " + err);
      throw err;
    }
  }

  app.post('/addLessonPlan', async (req, res) => {
    const { lessonName, lessonDate, lessonDetails, username } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
  
    try {
      // Call the 'addNewPlan' function and pass the necessary parameters
      await addNewPlan(username, lessonName, lessonDate, lessonDetails);
      res.json({ message: 'Lesson plan added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add lesson plan' });
    }
  });

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
  