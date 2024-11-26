const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT=3000

const app = express();
app.use(bodyParser.json());
app.use(cors());
console.log("listening on port");

const rooms = {}; // MongoDB will be added when needed


app.use(express.static('roomJoin.html')) //listening to the folder

app.post('createRoom', (req, res) => {
    const roomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomKey] = { users: [] };
    res.json({ roomKey });
});

app.post('/join-room', (req, res) => {
    const { roomKey, username } = req.body;

app.get('roomKey', (req, res) => {
    const { roomKey } = req.params;

    if (!rooms[roomKey]) {
        return res.json({ message: 'Room not found' });
    }
    res.json({ users: rooms[roomKey].users });
});
    if (!rooms[roomKey]) {
        return res.status(404).send('Room not found');
    }

    rooms[roomKey].users.push(username);
    res.json({ message: 'Room joined', users: rooms[roomKey].users });
});

