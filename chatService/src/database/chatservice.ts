import { db } from './knexConfig'; // Assuming you use Knex for DB interactions

// Save a message to a chat room
export const saveMessage = async (message: { chat_room_id: number, user_id: number, message: string }) => {
  try {
    await db('messages').insert({
      chat_room_id: message.chat_room_id,
      user_id: message.user_id,
      content: message.message,  // Use 'content' to store the message text
    });
  } catch (error) {
    console.error('Error saving message to chat room:', error);
    throw new Error('Failed to save message to chat room');
  }
};


// Get all messages in a chat room
export const getMessagesByRoom = async (roomId: number) => {
  try {
    const messages = await db('messages')
      .where({ chat_room_id: roomId })
      .orderBy('timestamp', 'asc'); // Sort by timestamp
    return messages;
  } catch (error) {
    console.error('Error fetching messages for room:', error);
    throw new Error('Failed to fetch messages for room');
  }
};

// Save a direct message (DM) between two users
export const saveDirectMessage = async (message: { sender_id: number, recipient_id: number, message: string }) => {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Convert to 'YYYY-MM-DD HH:MM:SS' format
    
    await db('direct_messages').insert({
      sender_id: message.sender_id,
      recipient_id: message.recipient_id,
      message: message.message,
      timestamp,  // Use the correctly formatted timestamp
    });
  } catch (error) {
    console.error('Error saving direct message:', error);
    throw new Error('Failed to save direct message');
  }
};

// Get direct messages between two users
export const getDirectMessages = async (senderId: number, recipientId: number) => {
  try {
    const messages = await db('direct_messages')
      .where(function() {
        this.where({ sender_id: senderId, recipient_id: recipientId })
            .orWhere({ sender_id: recipientId, recipient_id: senderId });
      })
      .orderBy('timestamp', 'asc'); // Sort by timestamp
    return messages;
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    throw new Error('Failed to fetch direct messages');
  }
};
