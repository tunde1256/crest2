import dotenv from 'dotenv';
import express, { Application } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { PORT } from './config';
import Room from './model/room'; // Room model
import RoomMessage from './model/roomMessage'; // RoomMessage model
import DirectMessage from './model/directMessages'; // DirectMessage model
import db from './database/db'; // Ensure MongoDB connection
import {scheduleCleanupJobs} from './cleanJob';


dotenv.config();


db;

scheduleCleanupJobs();

interface CustomWebSocket extends WebSocket {
  user?: any;
  isAlive?: boolean;
}

const app: Application = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/api/chat' });

app.use(bodyParser.json());

const userConnections: { [userId: string]: WebSocket[] } = {};
const rooms: { [roomId: string]: CustomWebSocket[] } = {};

// WebSocket keep-alive mechanism
const heartbeat = (ws: CustomWebSocket) => {
  ws.isAlive = true;
};

// JWT Token Authentication using Axios to fetch user details
export const authenticateUser = async (token: string) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

// Function to fetch user details from the external service
const fetchUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:4040/api/users/${userId}`);
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch user details from external service');
  }
};

// Handle WebSocket connections
wss.on('connection', (ws: CustomWebSocket, req) => {
  console.log('New WebSocket connection:', req.headers);

  ws.isAlive = true;

  ws.on('message', async (data) => {
    console.log('Received message:', data.toString());
    try {
      const parsedData = JSON.parse(data.toString());
      const { type, token, roomId, message, receiverId, roomName } = parsedData;

      switch (type) {
        case 'authenticate':
          try {
            const user = await authenticateUser(token);
            const userId = (user as { id: string }).id;

            const userDetails = await fetchUserDetails(userId);
            if (!userDetails) throw new Error('User not found');

            ws.user = userDetails;
            if (!userConnections[userId]) userConnections[userId] = [];
            userConnections[userId].push(ws);

            console.log('Authenticated user:', ws.user);

            ws.send(JSON.stringify({
              type: 'authenticated',
              success: true,
              user: ws.user,
              message: `Welcome, ${ws.user.fullname || 'User'}!`,
            }));
          } catch (err: any) {
            console.error('Authentication failed:', err.message);
            ws.send(JSON.stringify({ type: 'authenticated', success: false, error: 'Invalid token' }));
            ws.close(1008, 'Invalid token');
          }
          break;

        case 'direct_message':
          if (!ws.user) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication required' }));
            break;
          }

          if (!message) {
            ws.send(JSON.stringify({ type: 'error', message: 'Receiver ID and message are required' }));
            break;
          }

          const senderName = ws.user?.fullname || 'Anonymous'; // Ensure sender name is not null

          // Save direct message to the database
          const directMessage = new DirectMessage({
            senderId: ws.user.id,
            senderName,
            receiverId,
            message,
            timestamp: new Date(),
          });

          await directMessage.save();

          // Check if the receiver is connected
          const receiverConnections = userConnections[receiverId];
          if (receiverConnections && receiverConnections.length > 0) {
            receiverConnections.forEach((receiverWs) => {
              if (receiverWs.readyState === WebSocket.OPEN) {
                receiverWs.send(JSON.stringify({
                  type: 'new_direct_message',
                  senderId: ws.user?.id,
                  senderName,
                  message,
                }));
              }
            });

            ws.send(JSON.stringify({
              type: 'direct_message_sent',
              message: `Message sent to user ${receiverId}`,
            }));
          } else {
            ws.send(JSON.stringify({
              type: 'error',
              message: `User ${receiverId} is not connected`,
            }));
          }
          break;

        case 'create_room':
          if (!ws.user) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication required' }));
            break;
          }

          if (!roomName) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room name is required' }));
            break;
          }

          const newRoom = new Room({
            name: roomName,
            createdBy: ws.user.id,
            roomId: `room_${Date.now()}`,
            users: [ws.user.id],
          });

          await newRoom.save();
          rooms[newRoom.roomId] = [ws];
          await Room.findOneAndUpdate({ roomId: newRoom.roomId }, { $addToSet: { members: ws.user.id } });

          ws.send(JSON.stringify({
            type: 'room_created',
            message: `Room "${roomName}" created successfully`,
            roomId: newRoom.roomId,
            roomName: newRoom.name,
          }));
          break;

        case 'join_room':
          if (!ws.user) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication required' }));
            break;
          }

          if (!roomId) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room ID is required' }));
            break;
          }

          const roomFromDb = await Room.findOne({ roomId });
          if (!roomFromDb) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
            break;
          }

          if (roomFromDb.users.includes(ws.user.id)) {
            ws.send(JSON.stringify({
              type: 'already_member',
              message: `You are already a member of room "${roomId}". Feel free to send a message.`,
            }));
            break;
          }

          roomFromDb.users.push(ws.user.id);
          await roomFromDb.save();

          rooms[roomId] = rooms[roomId] || [];
          rooms[roomId].push(ws);

          ws.send(JSON.stringify({
            type: 'room_joined',
            message: `Joined room "${roomId}" successfully`,
          }));
          break;

        case 'send_room_message':
          if (!roomId || !message) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room ID and message are required' }));
            break;
          }

          const roomSenderName = ws.user?.fullname || 'Anonymous';

          const roomMessage = new RoomMessage({
            roomId,
            senderId: ws.user?.id,
            senderName: roomSenderName,
            message,
          });
          await roomMessage.save();

          if (rooms[roomId]) {
            rooms[roomId].forEach((roomWs) => {
              if (roomWs.readyState === WebSocket.OPEN) {
                roomWs.send(JSON.stringify({
                  type: 'new_room_message',
                  sender: roomSenderName,
                  message,
                }));
              }
            });
          }
          break;

        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
          break;
      }
    } catch (err: any) {
      console.error('Error handling message:', err.message);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      ws.close(1002, 'Invalid message format');
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason || 'No reason provided'}`);
    if (ws.user) {
      userConnections[ws.user.id] = userConnections[ws.user.id]?.filter((conn) => conn !== ws);
    }
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((conn) => conn !== ws);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }
  });

  ws.on('pong', () => heartbeat(ws));
});

setInterval(() => {
  wss.clients.forEach((ws: CustomWebSocket) => {
    if (!ws.isAlive) {
      ws.terminate();
    } else {
      ws.isAlive = false;
      ws.ping();
    }
  });
}, 30000);

server.listen(PORT, () => {
  console.log(`WebSocket server started on ws://localhost:${PORT}/api/chat`);
});
