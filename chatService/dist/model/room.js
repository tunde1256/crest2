"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true }, // User ID of the creator
    users: { type: [String], default: [] }, // Array of user IDs in the room
    name: { type: String, required: true }, // Add the name field to the schema
}, { timestamps: true });
exports.default = mongoose_1.default.model('Room', RoomSchema);
