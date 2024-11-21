const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(bodyParser.json())
app.use(cors());

console.log("listening on port")

const rooms = {} //mongo DB will be added wehn needed 


app.post('/create-room', (req,res)=>{
    const roomkey = Math.random().toString(36).substring(2,8).ToupperCase()
    rooms[roomKey] = {users: []}
    res.json({ roomkey })
})

app.post('/join-room', (req, res) => {
    const roomkey = { roomKey , username} = req.body

    if(!rooms[roomKey]){
        return res.status(404).send('Room not found')
    }
    
    rooms [roomKey].users.push(username)
    res.json({message:'Room joined ', users: rooms[roomKey].users})
})

app.get('/room:roomKey', (req,res) =>{
    const { roomKey} = req.params

    if (!rooms[roomKey]){
        return res.json({message:'Incorrect code', users:rooms[roomKey].users})
    }
})
