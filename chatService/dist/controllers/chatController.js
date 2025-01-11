"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessagesController = exports.sendMessageController = exports.getRoomsController = exports.createRoomController = void 0;
const authService_1 = require("../services/authService");
const roomService_1 = require("../services/roomService");
const messageService_1 = require("../services/messageService");
// Controller to handle room creation
const createRoomController = async (req, res) => {
    const { roomId, token } = req.body;
    if (!roomId) {
        return res.status(400).json({ type: 'error', message: 'Room ID is required' });
    }
    try {
        // Authenticate the user
        const user = await (0, authService_1.authenticateUser)(token);
        const rooms = await getRooms();
        // Create the room (using room service)
        const roomCreated = await (0, roomService_1.createRoom)(roomId, rooms);
        if (roomCreated) {
            return res.status(201).json({
                type: 'success',
                message: `Room ${roomId} has been created by ${user.fullname}!`,
                roomId,
            });
        }
        else {
            return res.status(400).json({ type: 'error', message: 'Room already exists' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ type: 'error', message: 'Invalid token or authentication failed' });
    }
};
exports.createRoomController = createRoomController;
// Controller to fetch all rooms
const getRoomsController = async (req, res) => {
    try {
        const rooms = await getRooms();
        return res.status(200).json({ type: 'success', rooms });
    }
    catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ type: 'error', message: 'Unable to fetch rooms' });
    }
};
exports.getRoomsController = getRoomsController;
// Controller to send a message to a room
const sendMessageController = async (req, res) => {
    const { roomId, message, token } = req.body;
    if (!roomId || !message) {
        return res.status(400).json({ type: 'error', message: 'Room ID and message are required' });
    }
    try {
        const user = await (0, authService_1.authenticateUser)(token); // Authenticate the user
        // Call the service to send the message
        const newMessage = await (0, messageService_1.sendMessage)(roomId, message, user.id);
        return res.status(200).json({
            type: 'success',
            message: 'Message sent successfully',
            newMessage,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ type: 'error', message: 'Failed to send message' });
    }
};
exports.sendMessageController = sendMessageController;
// Fetch all messages for a room
const fetchMessagesController = async (req, res) => {
    const { roomId } = req.params;
    if (!roomId) {
        return res.status(400).json({ type: 'error', message: 'Room ID is required' });
    }
    try {
        const messages = await (0, messageService_1.fetchMessages)(roomId); // Fetch messages (using message service)
        return res.status(200).json({
            type: 'success',
            messages,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ type: 'error', message: 'Failed to fetch messages' });
    }
};
exports.fetchMessagesController = fetchMessagesController;
// Helper function to get all rooms
async function getRooms() {
    try {
        return await (0, roomService_1.getAllRooms)({});
    }
    catch (error) {
        console.error('Error fetching rooms:', error);
        throw new Error('Unable to fetch rooms');
    }
}
