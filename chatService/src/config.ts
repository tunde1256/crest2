import { config as configDotenv } from 'dotenv';

configDotenv();

export const PORT = process.env.PORT || 4000;
export const USER_SERVICE_URL = 'http://localhost:4040/api/users/';
export const JWT_SECRET = '5c8e8bb75958777377211c4159d4f5f126425c37d16971e395995b5367bdd846f794159d92c8c689da95ab013648e1377fb967bd0ad93b5dec5a3cdeceb971a9';

