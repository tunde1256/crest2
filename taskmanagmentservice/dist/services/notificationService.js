"use strict";
// // services/notificationService.ts
// import sendEmail from './emailservice'; // Import the email service
// import { Notification } from '../Model/notificationmodel';  // Assuming you have a Notification model
// import axios from 'axios';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotification = exports.sendNotification = exports.saveNotification = void 0;
// interface NotificationData {
//   user_id: string;
//   message: string;
//   timestamp: Date;
// }
// export const createNotification = async ({ user_id, message, timestamp }: NotificationData): Promise<void> => {
//   try {
//     // Save notification to your database
//     const createdNotification = await Notification.create({ user_id, message, timestamp });
//     // Fetch the user's email using an external service (user service)
//     const userEmail = await getUserEmail(user_id);
//     if (userEmail) {
//       // Send email to the user with the correct object format
//       await sendEmail({
//         to: userEmail, 
//         subject: 'New Notification', 
//         text: message,
//       });
//     }
//     console.log('Notification created and email sent');
//   } catch (error) {
//     console.error('Error creating notification or sending email:', error);
//   }
// };
// const getUserEmail = async (user_id: string): Promise<string | null> => {
//   try {
//     // Fetch the user's email by user_id from a user service or database
//     const userResponse = await axios.get(`http://userservice/api/users/${user_id}`);
//     return userResponse.data ? userResponse.data.email : null;
//   } catch (error) {
//     console.error('Error fetching user email:', error);
//     return null;
//   }
// };
const knex_1 = __importDefault(require("../db/knex"));
// Function to save notifications to the database
const saveNotification = (notificationData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [createdNotification] = yield (0, knex_1.default)('notifications')
            .insert({
            user_id: notificationData.user_id,
            message: notificationData.message,
            timestamp: notificationData.timestamp,
        })
            .returning('*');
        return createdNotification;
    }
    catch (error) {
        console.error('Error saving notification:', error);
        throw new Error('Failed to save notification');
    }
});
exports.saveNotification = saveNotification;
// Function to send notifications directly
const sendNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Sending notification to user ${notification.user_id}: ${notification.message}`);
        // Implement your notification delivery mechanism here (e.g., push notifications, WebSocket, or third-party APIs)
    }
    catch (error) {
        console.error(`Failed to send notification: ${error.message}`);
        throw new Error('Notification delivery failed');
    }
});
exports.sendNotification = sendNotification;
// Unified notification handler
const handleNotification = (notificationData_1, ...args_1) => __awaiter(void 0, [notificationData_1, ...args_1], void 0, function* (notificationData, options = { saveToDatabase: true, sendDirectly: true }) {
    try {
        // Save to the database if the option is enabled
        if (options.saveToDatabase) {
            yield (0, exports.saveNotification)(notificationData);
        }
        // Send directly if the option is enabled
        if (options.sendDirectly) {
            yield (0, exports.sendNotification)(notificationData);
        }
    }
    catch (error) {
        console.error('Error handling notification:', error);
        throw new Error('Notification handling failed');
    }
});
exports.handleNotification = handleNotification;
