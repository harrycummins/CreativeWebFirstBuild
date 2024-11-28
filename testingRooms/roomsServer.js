const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT=3000

const app = express();
app.use(bodyParser.json());
app.use(cors());
const path = require('path')


app.listen(PORT, ()=>{
    console.log('listening on port' + PORT)
})

//code within here is my own

const rooms = {}; // MongoDB will be added when needed, is being stored localy for now




app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/roomJoin.html')); //sends the user straight to the frontend page
})

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


