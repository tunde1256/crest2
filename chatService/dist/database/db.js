"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
// MongoDB connection URL and options
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chatdb';
// Connect to MongoDB
mongoose_1.default
    .connect(mongoUri, {})
    .then(() => {
    console.log('Connected to the MongoDB database successfully!');
})
    .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
});
// Export mongoose to use for schema definitions elsewhere
exports.default = mongoose_1.default;
