"use strict";
// roomService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = void 0;
exports.getAllRooms = getAllRooms;
const createRoom = (roomId, rooms) => {
    if (!rooms[roomId]) {
        rooms[roomId] = []; // Create a new room
        return true; // Room created successfully
    }
    return false; // Room already exists
};
exports.createRoom = createRoom;
// Add user to a room
const joinRoom = (roomId, ws, rooms) => {
    if (!rooms[roomId]) {
        return { success: false, message: 'Room does not exist' };
    }
    // Add WebSocket to room
    rooms[roomId].push(ws);
    return { success: true, message: `Joined room ${roomId}` };
};
exports.joinRoom = joinRoom;
// Remove user from room (when they disconnect or leave the room)
const leaveRoom = (roomId, ws, rooms) => {
    if (!rooms[roomId]) {
        return { success: false, message: 'Room does not exist' };
    }
    const index = rooms[roomId].indexOf(ws);
    if (index !== -1) {
        rooms[roomId].splice(index, 1); // Remove WebSocket from room
        return { success: true, message: `Left room ${roomId}` };
    }
    return { success: false, message: 'User not in room' };
};
exports.leaveRoom = leaveRoom;
// Fetch all available rooms
async function getAllRooms(rooms) {
    return rooms;
}
;
