"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDirectMessages = exports.fetchMessages = exports.sendMessage = void 0;
const chatmodel_1 = require("../model/chatmodel"); // Assume MongoDB models are defined here
// Send a message to a chat room or as a direct message
const sendMessage = async (roomId, message, senderId, recipientId) => {
    if (!message || message.trim().length === 0) {
        throw new Error('Message content is required');
    }
    if (!roomId && !recipientId) {
        throw new Error('Either roomId or recipientId must be provided');
    }
    if (roomId) {
        // Room-based message
        const newMessage = new chatmodel_1.MessageModel({
            chatRoomId: roomId,
            senderId: senderId,
            message: message,
        });
        try {
            await newMessage.save(); // Save the room message to MongoDB
            return newMessage;
        }
        catch (error) {
            console.error('Error saving message to chat room:', error);
            throw new Error(`Failed to save room message: ${error.message}`);
        }
    }
    if (recipientId) {
        // Direct message (DM)
        const newDirectMessage = new chatmodel_1.DirectMessageModel({
            senderId: senderId,
            recipientId: recipientId,
            message: message,
        });
        try {
            await newDirectMessage.save(); // Save the direct message to MongoDB
            return newDirectMessage;
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
        return await chatmodel_1.MessageModel.find({ chatRoomId: roomId }).sort({ createdAt: 1 });
    }
    catch (error) {
        throw new Error(`Failed to fetch messages for room ${roomId}: ${error.message}`);
    }
};
exports.fetchMessages = fetchMessages;
// Fetch direct messages between two users
const fetchDirectMessages = async (senderId, recipientId) => {
    try {
        return await chatmodel_1.DirectMessageModel.find({
            $or: [
                { senderId: senderId, recipientId: recipientId },
                { senderId: recipientId, recipientId: senderId },
            ],
        }).sort({ createdAt: 1 });
    }
    catch (error) {
        throw new Error(`Failed to fetch direct messages: ${error.message}`);
    }
};
exports.fetchDirectMessages = fetchDirectMessages;
