const express = require('express');
const app = express();
const PORT=3000
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser');


app.listen(PORT, ()=>{
    console.log('listening on port' + PORT)
})

//use CONSOLE>LOG 



// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json()); // Parse JSON bodies

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resourceStorage.html')); // connecting to the login page when localhost is loaded
});
// app.get('/'),(request,response) =>{
//     console.log(request.body)
//  }
// Route to handle form submission
app.post('/submit-form', (req, res) => {
    const formData = req.body;

    console.log('Received form data:', formData);

    // Send response to the frontend
    res.status(200).json({
        message: 'Form data received successfully!',
        data: formData, // Send back the submitted data
    });
});










// app.use (express.static('teachersRooms'))

// const lessonPlan={}


// app.use(express.urlencoded({extended: false}))

 


// app.get('/', (request,response)=>{
//     response.sendFile(path.join(__dirname, '/teachersRooms', 'resourceStorage.html'))
// })

