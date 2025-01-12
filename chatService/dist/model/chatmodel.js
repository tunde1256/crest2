"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectMessageModel = exports.MessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    chatRoomId: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);
const DirectMessageSchema = new mongoose_1.default.Schema({
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });
exports.MessageModel = mongoose_1.default.model('Message', MessageSchema);
exports.DirectMessageModel = mongoose_1.default.model('DirectMessage', DirectMessageSchema);
