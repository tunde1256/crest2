export interface User {
    id: number;
    full_name: string;
    email: string;
    phone_number?: string;
    role: string;
  }
  
  export interface Message {
    id?: number;
    chat_room_id: number;
    user_id: number;
    message: string;
    timestamp?: Date;
  }
  