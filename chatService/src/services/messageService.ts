import { MessageModel, DirectMessageModel } from '../model/chatmodel'; // Assume MongoDB models are defined here

// Send a message to a chat room or as a direct message
export const sendMessage = async (
  roomId: string | null,
  message: string,
  senderId: string,
  recipientId?: string
): Promise<any> => {
  if (!message || message.trim().length === 0) {
    throw new Error('Message content is required');
  }

  if (!roomId && !recipientId) {
    throw new Error('Either roomId or recipientId must be provided');
  }

  if (roomId) {
    // Room-based message
    const newMessage = new MessageModel({
      chatRoomId: roomId,
      senderId: senderId,
      message: message,
    });

    try {
      await newMessage.save(); // Save the room message to MongoDB
      return newMessage;
    } catch (error: any) {
      console.error('Error saving message to chat room:', error);
      throw new Error(`Failed to save room message: ${error.message}`);
    }
  }

  if (recipientId) {
    // Direct message (DM)
    const newDirectMessage = new DirectMessageModel({
      senderId: senderId,
      recipientId: recipientId,
      message: message,
    });

    try {
      await newDirectMessage.save(); // Save the direct message to MongoDB
      return newDirectMessage;
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
    return await MessageModel.find({ chatRoomId: roomId }).sort({ createdAt: 1 });
  } catch (error: any) {
    throw new Error(`Failed to fetch messages for room ${roomId}: ${error.message}`);
  }
};

// Fetch direct messages between two users
export const fetchDirectMessages = async (senderId: string, recipientId: string) => {
  try {
    return await DirectMessageModel.find({
      $or: [
        { senderId: senderId, recipientId: recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).sort({ createdAt: 1 });
  } catch (error: any) {
    throw new Error(`Failed to fetch direct messages: ${error.message}`);
  }
};
