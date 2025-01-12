"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true },
    message: { type: String, required: true },
    sender: { type: String, required: true }, // User ID of the sender
}, { timestamps: true });
exports.default = mongoose_1.default.model('Message', MessageSchema);
