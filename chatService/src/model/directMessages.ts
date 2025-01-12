import mongoose, { Schema, Document } from 'mongoose';

const directMessageSchema = new Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderName: { type: String, required: true },
  receiverName: { type: String},
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;
