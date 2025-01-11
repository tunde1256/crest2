"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Ensure you have jwt package installed
const config_1 = require("./config"); // Replace with your config
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server, path: '/api/chat' });
app.use(body_parser_1.default.json());
const userConnections = {};
const rooms = {};
// WebSocket keep-alive mechanism
const heartbeat = (ws) => {
    ws.isAlive = true;
};
// JWT Token Authentication
const authenticateUser = async (token) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key
        return decoded;
    }
    catch (err) {
        throw new Error('Invalid token');
    }
};
exports.authenticateUser = authenticateUser;
// Handle WebSocket connections
wss.on('connection', (ws, req) => {
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
                        const user = await (0, exports.authenticateUser)(token);
                        ws.user = user;
                        const userId = user.id;
                        if (!userConnections[userId])
                            userConnections[userId] = [];
                        userConnections[user.id].push(ws);
                        ws.send(JSON.stringify({
                            type: 'authenticated',
                            success: true,
                            user,
                            message: `Welcome, ${user.fullname || 'User'}!`,
                        }));
                    }
                    catch (err) {
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
                    if (!rooms[roomId])
                        rooms[roomId] = [];
                    rooms[roomId].push(ws);
                    ws.send(JSON.stringify({ type: 'join_room_confirmation', roomId, message: 'Joined room' }));
                    break;
                case 'send_message':
                    if (!rooms[roomId]) {
                        ws.send(JSON.stringify({ type: 'error', message: `Room ${roomId} does not exist` }));
                        break;
                    }
                    rooms[roomId].forEach((client) => {
                        if (client.readyState === ws_1.WebSocket.OPEN) {
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
        }
        catch (err) {
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
            if (rooms[roomId].length === 0)
                delete rooms[roomId];
        }
    });
    ws.on('error', (error) => console.error('WebSocket error:', error.message));
    ws.on('pong', () => heartbeat(ws));
});
setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.isAlive === false)
            return client.terminate();
        client.isAlive = false;
        client.ping();
    });
}, 30000);
server.listen(config_1.PORT || 2080, () => {
    console.log(`WebSocket server running on port ${config_1.PORT || 2080}`);
});
