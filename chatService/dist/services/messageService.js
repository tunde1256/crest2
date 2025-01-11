"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDirectMessages = exports.fetchMessages = exports.sendMessage = void 0;
const chatservice_1 = require("../database/chatservice");
const sendMessage = async (roomId, message, senderId, recipientId // receiver ID is optional for room messages, required for direct messages
) => {
    // Validate the input
    if (!message || message.trim().length === 0) {
        throw new Error('Message content is required');
    }
    if (!roomId && !recipientId) {
        throw new Error('Either roomId or recipientId must be provided');
    }
    if (roomId) {
        // Room-based message
        const newMessage = {
            chat_room_id: Number(roomId),
            user_id: Number(senderId),
            message: message, // Ensure that 'message' is used consistently in the database
            // sent_at will be handled automatically by MySQL, no need for timestamp here
        };
        try {
            await (0, chatservice_1.saveMessage)(newMessage); // Save the room message in the database
            return newMessage;
        }
        catch (error) {
            console.error('Error saving message to chat room:', error);
            throw new Error(`Failed to save room message: ${error.message}`);
        }
    }
    if (recipientId) {
        // Direct message (DM) to a specific recipient
        const newMessage = {
            sender_id: Number(senderId),
            recipient_id: Number(recipientId), // recipientId is used here
            message: message, // Ensure that 'message' is used for the message text
            // sent_at will be handled automatically by MySQL, no need for timestamp here
        };
        try {
            await (0, chatservice_1.saveDirectMessage)(newMessage); // Save the direct message in the database
            return newMessage;
        }
        catch (error) {
            console.error('Error saving direct message:', error);
            throw new Error(`Failed to save direct message: ${error.message}`);
        }
    }
    throw new Error('Either roomId or recipientId must be provided');
};
exports.sendMessage = sendMessage;
// Fetch messages for a specific room
const fetchMessages = async (roomId) => {
    try {
        return await (0, chatservice_1.getMessagesByRoom)(Number(roomId));
    }
    catch (error) {
        throw new Error(`Failed to fetch messages for room ${roomId}: ${error.message}`);
    }
};
exports.fetchMessages = fetchMessages;
// Fetch direct messages between two users
const fetchDirectMessages = async (senderId, recipientId) => {
    try {
        return await (0, chatservice_1.getDirectMessages)(Number(senderId), Number(recipientId));
    }
    catch (error) {
        throw new Error(`Failed to fetch direct messages: ${error.message}`);
    }
};
exports.fetchDirectMessages = fetchDirectMessages;
