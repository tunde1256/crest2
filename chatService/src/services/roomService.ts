// roomService.ts

export const createRoom = (roomId: string, rooms: { [roomId: string]: any[] }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = []; // Create a new room
      return true; // Room created successfully
    }
    return false; // Room already exists
  };
  
  // Add user to a room
  export const joinRoom = (roomId: string, ws: WebSocket, rooms: { [roomId: string]: any[] }) => {
    if (!rooms[roomId]) {
      return { success: false, message: 'Room does not exist' };
    }
  
    // Add WebSocket to room
    rooms[roomId].push(ws);
    return { success: true, message: `Joined room ${roomId}` };
  };
  
  // Remove user from room (when they disconnect or leave the room)
  export const leaveRoom = (roomId: string, ws: WebSocket, rooms: { [roomId: string]: any[] }) => {
    if (!rooms[roomId]) {
      return { success: false, message: 'Room does not exist' };
    }
  
    const index = rooms[roomId].indexOf(ws);
    if (index !== -1) {
      rooms[roomId].splice(index, 1); // Remove WebSocket from room
      return { success: true, message: `Left room ${roomId}` };
    }
  
    return { success: false, message: 'User not in room' };
  };
  
  // Fetch all available rooms
  export async function getAllRooms(rooms: { [roomId: string]: any[] }): Promise<{ [roomId: string]: any[] }> {
    return rooms;
  };
  