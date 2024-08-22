let rooms = [];

function generateRoomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const generateBoard = () => {
    const board = []
    for (let i = 0; i < 9; i++) {
        board.push({
            id: i,
            player: ''
        })
    }
    return board;
}

const createRoom = (player_name, room_name) => {
    const room = {
        id: generateRoomId(),
        moves: 1,
        room_name: room_name,
        players: [player_name],
        board: generateBoard(),
        guests: [],
        turn: null,
        winner: null
    }
    rooms.push(room)
    return room
}

const getRoomWinner = (board) => {
    for (const [v1, v2, v3] of combWinner) {

        const p1 = board[v1].player;
        const p2 = board[v2].player;
        const p3 = board[v3].player;

        if (p1 && p2 && p3 && p1 === p2 && p2 === p3) {
            return true;
        }


    }
    return false;
}

const combWinner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

export { createRoom, getRoomWinner, generateBoard, rooms }
