import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import userRoutes from './routes/userroutes';
import db from './db/db';
import { connectToRabbitMq, sendToQueue, startConsuming } from './rabbitmq';  // Adjust the import path if needed

console.log('Environment Variables Loaded:');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET);

const port = process.env.PORT || 3000;

const app: Application = express();

// Database connection
db();

// Connect to RabbitMQ and start consuming messages
connectToRabbitMq().then(() => {
  startConsuming();
});

// Example route to send message to RabbitMQ queue
app.post('/send-message', (req, res) => {
  const { message } = req.body;
  if (message) {
    sendToQueue(message);
    res.status(200).send('Message sent to RabbitMQ queue!');
  } else {
    res.status(400).send('No message provided.');
  }
});

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
