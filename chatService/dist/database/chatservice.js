"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectMessages = exports.saveDirectMessage = exports.getMessagesByRoom = exports.saveMessage = void 0;
const knexConfig_1 = require("./knexConfig"); // Assuming you use Knex for DB interactions
// Save a message to a chat room
const saveMessage = async (message) => {
    try {
        await (0, knexConfig_1.db)('messages').insert({
            chat_room_id: message.chat_room_id,
            user_id: message.user_id,
            content: message.message, // Use 'content' to store the message text
        });
    }
    catch (error) {
        console.error('Error saving message to chat room:', error);
        throw new Error('Failed to save message to chat room');
    }
};
exports.saveMessage = saveMessage;
// Get all messages in a chat room
const getMessagesByRoom = async (roomId) => {
    try {
        const messages = await (0, knexConfig_1.db)('messages')
            .where({ chat_room_id: roomId })
            .orderBy('timestamp', 'asc'); // Sort by timestamp
        return messages;
    }
    catch (error) {
        console.error('Error fetching messages for room:', error);
        throw new Error('Failed to fetch messages for room');
    }
};
exports.getMessagesByRoom = getMessagesByRoom;
// Save a direct message (DM) between two users
const saveDirectMessage = async (message) => {
    try {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert to 'YYYY-MM-DD HH:MM:SS' format
        await (0, knexConfig_1.db)('direct_messages').insert({
            sender_id: message.sender_id,
            recipient_id: message.recipient_id,
            message: message.message,
            timestamp, // Use the correctly formatted timestamp
        });
    }
    catch (error) {
        console.error('Error saving direct message:', error);
        throw new Error('Failed to save direct message');
    }
};
exports.saveDirectMessage = saveDirectMessage;
// Get direct messages between two users
const getDirectMessages = async (senderId, recipientId) => {
    try {
        const messages = await (0, knexConfig_1.db)('direct_messages')
            .where(function () {
            this.where({ sender_id: senderId, recipient_id: recipientId })
                .orWhere({ sender_id: recipientId, recipient_id: senderId });
        })
            .orderBy('timestamp', 'asc'); // Sort by timestamp
        return messages;
    }
    catch (error) {
        console.error('Error fetching direct messages:', error);
        throw new Error('Failed to fetch direct messages');
    }
};
exports.getDirectMessages = getDirectMessages;
