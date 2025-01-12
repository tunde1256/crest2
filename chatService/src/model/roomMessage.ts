import mongoose, { Schema, Document } from 'mongoose';

const roomMessageSchema = new Schema({
  roomId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const RoomMessage = mongoose.model('RoomMessage', roomMessageSchema);

export default RoomMessage;
