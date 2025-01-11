import axios from 'axios';
import jwt from 'jsonwebtoken';
import { USER_SERVICE_URL, JWT_SECRET } from '../config';

export const authenticateUser = async (token: string) => {
    try {
      console.log('Received token:', token);
  
      const decoded: any = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
  
      const userId = decoded.id;
      console.log('Fetching user data for ID:', userId);
  
      const url = `${USER_SERVICE_URL}${userId}`;
      console.log('Final URL:', url);
  
      const response = await axios.get(url);
      console.log('User service response:', response.data);
  
      if (response.status === 200 && response.data) {
        return response.data;
      }
  
      throw new Error('User not found');
    } catch (error:any) {
      console.error('Error in authenticateUser:', error.message);
      if (error.message === 'Invalid URL') {
        console.error('Check the USER_SERVICE_URL in config.ts');
      }
      throw new Error('Authentication failed');
    }
  };
  