"use strict";
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
exports.startConsuming = exports.sendToQueue = exports.connectToRabbitMq = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
let channel;
// Connect to RabbitMQ
const connectToRabbitMq = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(rabbitMqUrl);
        channel = yield connection.createChannel();
        console.log('Connected to RabbitMQ');
        // Declare a queue
        yield channel.assertQueue('userQueue', { durable: true });
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
});
exports.connectToRabbitMq = connectToRabbitMq;
// Send message to RabbitMQ queue
const sendToQueue = (message) => {
    if (channel) {
        channel.sendToQueue('userQueue', Buffer.from(message), {
            persistent: true,
        });
        console.log(`Message sent to RabbitMQ queue: ${message}`);
    }
};
exports.sendToQueue = sendToQueue;
// Consume messages from the queue
const consumeFromQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    if (channel) {
        yield channel.consume('userQueue', (msg) => {
            if (msg) {
                console.log('Received message:', msg.content.toString());
                // Process the message here (e.g., create or update a user)
                channel.ack(msg);
            }
        });
    }
});
// Start consuming messages after connecting to RabbitMQ
const startConsuming = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectToRabbitMq();
    consumeFromQueue();
});
exports.startConsuming = startConsuming;
