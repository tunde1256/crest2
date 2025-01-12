"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRooms = exports.leaveRoom = exports.joinRoom = exports.createRoom = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Room schema
const RoomSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true, unique: true },
    users: { type: [String], default: [] }, // Array of user IDs (e.g., WebSocket IDs)
}, { timestamps: true });
// Create the Room model
const RoomModel = mongoose_1.default.model('Room', RoomSchema);
// Create a new room
const createRoom = async (roomId) => {
    try {
        const existingRoom = await RoomModel.findOne({ roomId });
        if (existingRoom) {
            return { success: false, message: 'Room already exists' };
        }
        const newRoom = new RoomModel({ roomId });
        await newRoom.save();
        return { success: true, message: 'Room created successfully' };
    }
    catch (error) {
        console.error('Error creating room:', error);
        return { success: false, message: 'Failed to create room' };
    }
};
exports.createRoom = createRoom;
// Add user to a room
const joinRoom = async (roomId, userId) => {
    try {
        const room = await RoomModel.findOne({ roomId });
        if (!room) {
            return { success: false, message: 'Room does not exist' };
        }
        if (!room.users.includes(userId)) {
            room.users.push(userId);
            await room.save();
        }
        return { success: true, message: `User ${userId} joined room ${roomId}` };
    }
    catch (error) {
        console.error('Error joining room:', error);
        return { success: false, message: 'Failed to join room' };
    }
};
exports.joinRoom = joinRoom;
// Remove user from a room
const leaveRoom = async (roomId, userId) => {
    try {
        const room = await RoomModel.findOne({ roomId });
        if (!room) {
            return { success: false, message: 'Room does not exist' };
        }
        const userIndex = room.users.indexOf(userId);
        if (userIndex !== -1) {
            room.users.splice(userIndex, 1);
            await room.save();
            return { success: true, message: `User ${userId} left room ${roomId}` };
        }
        return { success: false, message: 'User not in room' };
    }
    catch (error) {
        console.error('Error leaving room:', error);
        return { success: false, message: 'Failed to leave room' };
    }
};
exports.leaveRoom = leaveRoom;
// Fetch all available rooms
const getAllRooms = async () => {
    try {
        const rooms = await RoomModel.find({}, { roomId: 1, users: 1, _id: 0 }); // Fetch roomId and users only
        return { success: true, rooms };
    }
    catch (error) {
        console.error('Error fetching rooms:', error);
        return { success: false, message: 'Failed to fetch rooms' };
    }
};
exports.getAllRooms = getAllRooms;
