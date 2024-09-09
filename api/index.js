import express from "express";
import http from 'http'
import { Server } from "socket.io";
import { rooms, createRoom, getRoomWinner } from "./utils/Rooms.js";

const app = express()
const server = http.createServer(app)
 

app.use(express.json())
app.get('/', (req, res) => {
    res.json({ message: 'Server on' })
})

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {

    socket.emit('connected', 'Connected to server');

    socket.emit('rooms', rooms)

    socket.on('create-room', ({ player, room_name }) => {
        const room = createRoom(player, room_name)
        socket.join(room.id)
        io.to(room.id).emit('room-created', [room, rooms])
        socket.broadcast.emit('rooms', rooms)
    })

    socket.on('join-room', ({ room_id, player }) => {
        const room = rooms.find(room => room.id === room_id);
        if (room) {
            room.players.push(player)
            socket.join(room.id)

            if (room.players.length === 2)
                room.turn = Math.floor(Math.random() * 2);

            io.to(room.id).emit('room-joined', [room, rooms])
            socket.broadcast.emit('rooms', rooms)
        } else {
            socket.emit('room-error', 'Room not found')
        }
    })

    socket.on('move', ({ room_id, player, cell_id }) => {
        console.log(player, cell_id, room_id);
        const room = rooms.find(room => room.id === room_id)

        if (room) {
            const cell = room.board[cell_id]

            if (cell.player === '') {
                cell.player = room.turn
                room.turn = room.turn === 0 ? 1 : 0
                room.moves++

                if (room.moves >= 4) {
                    const winner = getRoomWinner(room.board)
                    if (winner) {
                        room.winner = player;
                    } else if (room.moves === 9) {
                        room.winner = 'draw'
                    }
                }

                io.to(room.id).emit('move', room)
            } else {
                socket.emit('move-error', 'Cell not empty')
            }

        } else {
            socket.emit('move-error', 'Room not found')
        }
    })

    socket.on('leave_room', (room_id) => {
        const room = rooms[room_id]
        if (room) {
            room.players = room.players.filter(player => player !== player_name)
            if (room.players.length === 0) {
                rooms = rooms.filter(room => room.id !== room_id)
            }
            io.to(room.id).emit('room-left', room)
        } else {
            socket.emit('room-error', 'Room not found')
        }


    });

});

server.listen(3000, () => {
    console.log("Server on: http://localhost:3000")
})


