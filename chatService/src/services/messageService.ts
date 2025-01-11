import { saveMessage, getMessagesByRoom, saveDirectMessage, getDirectMessages } from '../database/chatservice';

export const sendMessage = async (
  roomId: string | null, 
  message: string, 
  senderId: string, 
  recipientId?: string // receiver ID is optional for room messages, required for direct messages
): Promise<any> => {
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
      message: message,  // Ensure that 'message' is used consistently in the database
      // sent_at will be handled automatically by MySQL, no need for timestamp here
    };

    try {
      await saveMessage(newMessage);  // Save the room message in the database
      return newMessage;
    } catch (error: any) {
      console.error('Error saving message to chat room:', error);
      throw new Error(`Failed to save room message: ${error.message}`);
    }
  }

  if (recipientId) {
    // Direct message (DM) to a specific recipient
    const newMessage = {
      sender_id: Number(senderId),
      recipient_id: Number(recipientId),  // recipientId is used here
      message: message,  // Ensure that 'message' is used for the message text
      // sent_at will be handled automatically by MySQL, no need for timestamp here
    };

    try {
      await saveDirectMessage(newMessage);  // Save the direct message in the database
      return newMessage;
    } catch (error: any) {
      console.error('Error saving direct message:', error);
      throw new Error(`Failed to save direct message: ${error.message}`);
    }
  }

  throw new Error('Either roomId or recipientId must be provided');
};

// Fetch messages for a specific room
export const fetchMessages = async (roomId: string) => {
  try {
    return await getMessagesByRoom(Number(roomId));
  } catch (error: any) {
    throw new Error(`Failed to fetch messages for room ${roomId}: ${error.message}`);
  }
};

// Fetch direct messages between two users
export const fetchDirectMessages = async (senderId: string, recipientId: string) => {
  try {
    return await getDirectMessages(Number(senderId), Number(recipientId));
  } catch (error: any) {
    throw new Error(`Failed to fetch direct messages: ${error.message}`);
  }
};
