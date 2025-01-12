import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    chatRoomId: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const DirectMessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model('Message', MessageSchema);
export const DirectMessageModel = mongoose.model('DirectMessage', DirectMessageSchema);
