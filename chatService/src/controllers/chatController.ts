import { Request, Response } from 'express';
import { authenticateUser } from '../services/authService'; 
import { createRoom, getAllRooms } from '../services/roomService'; 
import { sendMessage, fetchMessages } from '../services/messageService'; 

// Controller to handle room creation
export const createRoomController = async (req: Request, res: Response): Promise<any> => {
  const { roomId, token } = req.body;

  if (!roomId) {
    return res.status(400).json({ type: 'error', message: 'Room ID is required' });
  }

  try {
    // Authenticate the user
    const user = await authenticateUser(token);
    const rooms = await getRooms(); 

    // Create the room (using room service)
    const roomCreated = await createRoom(roomId, rooms);

    if (roomCreated) {
      return res.status(201).json({
        type: 'success',
        message: `Room ${roomId} has been created by ${user.fullname}!`,
        roomId,
      });
    } else {
      return res.status(400).json({ type: 'error', message: 'Room already exists' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ type: 'error', message: 'Invalid token or authentication failed' });
  }
};

// Controller to fetch all rooms
export const getRoomsController = async (req: Request, res: Response): Promise<any> => {
  try {
    const rooms = await getRooms();
    return res.status(200).json({ type: 'success', rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return res.status(500).json({ type: 'error', message: 'Unable to fetch rooms' });
  }
};

// Controller to send a message to a room
export const sendMessageController = async (req: Request, res: Response): Promise<any> => {
    const { roomId, message, token } = req.body;
  
    if (!roomId || !message) {
      return res.status(400).json({ type: 'error', message: 'Room ID and message are required' });
    }
  
    try {
      const user = await authenticateUser(token); // Authenticate the user
  
      // Call the service to send the message
      const newMessage = await sendMessage(roomId, message, user.id);
  
      return res.status(200).json({
        type: 'success',
        message: 'Message sent successfully',
        newMessage,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ type: 'error', message: 'Failed to send message' });
    }
  };

// Fetch all messages for a room
export const fetchMessagesController = async (req: Request, res: Response): Promise<any> => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ type: 'error', message: 'Room ID is required' });
  }

  try {
    const messages = await fetchMessages(roomId); // Fetch messages (using message service)
    return res.status(200).json({
      type: 'success',
      messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ type: 'error', message: 'Failed to fetch messages' });
  }
};

// Helper function to get all rooms
async function getRooms(): Promise<{ [roomId: string]: any[] }> {
  try {
    return await getAllRooms({});
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Unable to fetch rooms');
  }
}
