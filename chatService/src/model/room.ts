import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true }, // User ID of the creator
  users: { type: [String], default: [] }, // Array of user IDs in the room
  name: { type: String, required: true }, // Add the name field to the schema

}, { timestamps: true });

export default mongoose.model('Room', RoomSchema);
