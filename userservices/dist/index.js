"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const userroutes_1 = __importDefault(require("./routes/userroutes"));
const db_1 = __importDefault(require("./db/db"));
const rabbitmq_1 = require("./rabbitmq"); // Adjust the import path if needed
console.log('Environment Variables Loaded:');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET);
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Database connection
(0, db_1.default)();
// Connect to RabbitMQ and start consuming messages
(0, rabbitmq_1.connectToRabbitMq)().then(() => {
    (0, rabbitmq_1.startConsuming)();
});
// Example route to send message to RabbitMQ queue
app.post('/send-message', (req, res) => {
    const { message } = req.body;
    if (message) {
        (0, rabbitmq_1.sendToQueue)(message);
        res.status(200).send('Message sent to RabbitMQ queue!');
    }
    else {
        res.status(400).send('No message provided.');
    }
});
app.use(express_1.default.json());
app.use('/api/users', userroutes_1.default);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
