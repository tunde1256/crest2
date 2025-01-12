import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// MongoDB connection URL and options
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chatdb';

// Connect to MongoDB
mongoose
  .connect(mongoUri, {
  })
  .then(() => {
    console.log('Connected to the MongoDB database successfully!');
  })
  .catch((error:any) => {
    console.error('MongoDB connection failed:', error.message);
  });

// Export mongoose to use for schema definitions elsewhere
export default mongoose;
