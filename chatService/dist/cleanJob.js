"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleCleanupJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const roomMessage_1 = __importDefault(require("./model/roomMessage")); // RoomMessage model
const directMessages_1 = __importDefault(require("./model/directMessages")); // DirectMessage model
const deleteOldMessages = async () => {
    try {
        // Calculate the timestamp for messages older than 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        // Delete room messages older than 90 days
        const roomMessagesResult = await roomMessage_1.default.deleteMany({
            timestamp: { $lt: ninetyDaysAgo },
        });
        // Delete direct messages older than 90 days
        const directMessagesResult = await directMessages_1.default.deleteMany({
            timestamp: { $lt: ninetyDaysAgo },
        });
        console.log(`Cleanup job completed: Deleted ${roomMessagesResult.deletedCount} room messages and ${directMessagesResult.deletedCount} direct messages`);
    }
    catch (err) {
        console.error('Error during cleanup job:', err.message);
    }
};
// Schedule the cleanup job to run every day at midnight
const scheduleCleanupJobs = () => {
    node_cron_1.default.schedule('0 0 * * *', deleteOldMessages, {
        scheduled: true,
        timezone: 'UTC', // Adjust timezone as necessary
    });
    console.log('Message cleanup job scheduled to run daily at midnight UTC');
};
exports.scheduleCleanupJobs = scheduleCleanupJobs;
