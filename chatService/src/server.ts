import express, { Application } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'; 
import { PORT } from './config'; 

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

// JWT Token Authentication
export const authenticateUser = async (token: string) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
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
      const { type, token, roomId, message } = parsedData;

      switch (type) {
        case 'authenticate':
          try {
            const user = await authenticateUser(token);
            ws.user = user;
            const userId = (user as { id: string }).id;
            if (!userConnections[userId]) userConnections[userId] = [];
            userConnections[(user as { id: string }).id].push(ws);

            ws.send(JSON.stringify({
              type: 'authenticated',
              success: true,
              user,
              message: `Welcome, ${(user as any).fullname || 'User'}!`,
            }));
          } catch (err: any) {
            console.error('Authentication failed:', err.message);
            ws.send(JSON.stringify({ type: 'authenticated', success: false, error: 'Invalid token' }));
            ws.close(1008, 'Invalid token');
          }
          break;

        case 'join_room':
          if (!ws.user) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication required' }));
            break;
          }
          if (!rooms[roomId]) rooms[roomId] = [];
          rooms[roomId].push(ws);
          ws.send(JSON.stringify({ type: 'join_room_confirmation', roomId, message: 'Joined room' }));
          break;

        case 'send_message':
          if (!rooms[roomId]) {
            ws.send(JSON.stringify({ type: 'error', message: `Room ${roomId} does not exist` }));
            break;
          }
          rooms[roomId].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'new_message',
                roomId,
                sender: ws.user?.fullname || 'Anonymous',
                message,
              }));
            }
          });
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

  ws.on('error', (error) => console.error('WebSocket error:', error.message));

  ws.on('pong', () => heartbeat(ws));
});

setInterval(() => {
  wss.clients.forEach((client: CustomWebSocket) => {
    if (client.isAlive === false) return client.terminate();
    client.isAlive = false;
    client.ping();
  });
}, 30000);

server.listen(PORT || 2080, () => {
  console.log(`WebSocket server running on port ${PORT || 2080}`);
});
