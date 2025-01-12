import mongoose, { Schema } from 'mongoose';

interface DirectMessage {
    sender: string;
    receiver: string;
    message: string;
    timestamp: Date;
  }
  
  const directMessageSchema = new Schema<DirectMessage>({
    sender: { type: String, required: true },
    receiver: { type: String, },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  });
  
  const DirectMessageModel = mongoose.model<DirectMessage>('DirectMessage', directMessageSchema);
  
  export default DirectMessageModel;
  