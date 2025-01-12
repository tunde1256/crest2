"use strict";
// import { Request, Response } from 'express';
// import { authenticateUser } from '../services/authService';
// import Room from '../model/room'; // Mongoose model for Room
// import Message from '../model/message'; // Mongoose model for Message
// // Controller to handle room creation
// export const createRoomController = async (req: Request, res: Response): Promise<any> => {
//   const { roomId, token } = req.body;
//   if (!roomId) {
//     return res.status(400).json({ type: 'error', message: 'Room ID is required' });
//   }
//   try {
//     // Authenticate the user
//     const user = await authenticateUser(token);
//     // Check if the room already exists
//     const existingRoom = await Room.findOne({ roomId });
//     if (existingRoom) {
//       return res.status(400).json({ type: 'error', message: 'Room already exists' });
//     }
//     // Create a new room
//     const newRoom = new Room({ roomId, createdBy: user.id });
//     await newRoom.save();
//     return res.status(201).json({
//       type: 'success',
//       message: `Room ${roomId} has been created by ${user.fullname}!`,
//       roomId,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ type: 'error', message: 'Invalid token or authentication failed' });
//   }
// };
// // Controller to fetch all rooms
// export const getRoomsController = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const rooms = await Room.find(); // Fetch all rooms from the database
//     return res.status(200).json({ type: 'success', rooms });
//   } catch (error) {
//     console.error('Error fetching rooms:', error);
//     return res.status(500).json({ type: 'error', message: 'Unable to fetch rooms' });
//   }
// };
// // Controller to send a message to a room
// export const sendMessageController = async (req: Request, res: Response): Promise<any> => {
//   const { roomId, message, token } = req.body;
//   if (!roomId || !message) {
//     return res.status(400).json({ type: 'error', message: 'Room ID and message are required' });
//   }
//   try {
//     const user = await authenticateUser(token); // Authenticate the user
//     // Check if the room exists
//     const room = await Room.findOne({ roomId });
//     if (!room) {
//       return res.status(404).json({ type: 'error', message: 'Room not found' });
//     }
//     // Create a new message
//     const newMessage = new Message({
//       roomId,
//       message,
//       sender: user.id,
//     });
//     await newMessage.save();
//     return res.status(200).json({
//       type: 'success',
//       message: 'Message sent successfully',
//       newMessage,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ type: 'error', message: 'Failed to send message' });
//   }
// };
// // Fetch all messages for a room
// export const fetchMessagesController = async (req: Request, res: Response): Promise<any> => {
//   const { roomId } = req.params;
//   if (!roomId) {
//     return res.status(400).json({ type: 'error', message: 'Room ID is required' });
//   }
//   try {
//     // Fetch messages for the specified room
//     const messages = await Message.find({ roomId }).sort({ createdAt: 1 }); // Sort by creation time
//     return res.status(200).json({
//       type: 'success',
//       messages,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ type: 'error', message: 'Failed to fetch messages' });
//   }
// };
