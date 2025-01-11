"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authenticateUser = async (token) => {
    try {
        console.log('Received token:', token);
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const userId = decoded.id;
        console.log('Fetching user data for ID:', userId);
        const url = `${config_1.USER_SERVICE_URL}${userId}`;
        console.log('Final URL:', url);
        const response = await axios_1.default.get(url);
        console.log('User service response:', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('User not found');
    }
    catch (error) {
        console.error('Error in authenticateUser:', error.message);
        if (error.message === 'Invalid URL') {
            console.error('Check the USER_SERVICE_URL in config.ts');
        }
        throw new Error('Authentication failed');
    }
};
exports.authenticateUser = authenticateUser;
