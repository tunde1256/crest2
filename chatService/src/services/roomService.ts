import mongoose from 'mongoose';

// Define the Room schema
const RoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    users: { type: [String], default: [] }, // Array of user IDs (e.g., WebSocket IDs)
  },
  { timestamps: true }
);

// Create the Room model
const RoomModel = mongoose.model('Room', RoomSchema);

// Create a new room
export const createRoom = async (roomId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const existingRoom = await RoomModel.findOne({ roomId });
    if (existingRoom) {
      return { success: false, message: 'Room already exists' };
    }

    const newRoom = new RoomModel({ roomId });
    await newRoom.save();
    return { success: true, message: 'Room created successfully' };
  } catch (error: any) {
    console.error('Error creating room:', error);
    return { success: false, message: 'Failed to create room' };
  }
};

// Add user to a room
export const joinRoom = async (roomId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const room = await RoomModel.findOne({ roomId });
    if (!room) {
      return { success: false, message: 'Room does not exist' };
    }

    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    return { success: true, message: `User ${userId} joined room ${roomId}` };
  } catch (error: any) {
    console.error('Error joining room:', error);
    return { success: false, message: 'Failed to join room' };
  }
};

// Remove user from a room
export const leaveRoom = async (roomId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const room = await RoomModel.findOne({ roomId });
    if (!room) {
      return { success: false, message: 'Room does not exist' };
    }

    const userIndex = room.users.indexOf(userId);
    if (userIndex !== -1) {
      room.users.splice(userIndex, 1);
      await room.save();
      return { success: true, message: `User ${userId} left room ${roomId}` };
    }

    return { success: false, message: 'User not in room' };
  } catch (error: any) {
    console.error('Error leaving room:', error);
    return { success: false, message: 'Failed to leave room' };
  }
};

// Fetch all available rooms
export const getAllRooms = async (): Promise<{ success: boolean; rooms?: any[]; message?: string }> => {
  try {
    const rooms = await RoomModel.find({}, { roomId: 1, users: 1, _id: 0 }); // Fetch roomId and users only
    return { success: true, rooms };
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return { success: false, message: 'Failed to fetch rooms' };
  }
};
