import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: String, required: true }, // User ID of the sender
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
