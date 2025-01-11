"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
// import { requireAuth } from './middleware/authMiddleware';
const router = (0, express_1.Router)();
// Protect routes that require authentication
router.post('/api/create_room', chatController_1.createRoomController);
router.get('/api/rooms', chatController_1.getRoomsController);
router.post('/api/send_message', chatController_1.sendMessageController);
router.get('/api/rooms/:roomId/messages', chatController_1.fetchMessagesController);
exports.default = router;
