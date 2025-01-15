import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

let channel: amqp.Channel;

// Connect to RabbitMQ
const connectToRabbitMq = async () => {
  try {
    const connection = await amqp.connect(rabbitMqUrl);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    // Declare a queue
    await channel.assertQueue('userQueue', { durable: true });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};

// Send message to RabbitMQ queue
const sendToQueue = (message: string) => {
  if (channel) {
    channel.sendToQueue('userQueue', Buffer.from(message), {
      persistent: true,
    });
    console.log(`Message sent to RabbitMQ queue: ${message}`);
  }
};

// Consume messages from the queue
const consumeFromQueue = async () => {
  if (channel) {
    await channel.consume('userQueue', (msg) => {
      if (msg) {
        console.log('Received message:', msg.content.toString());
        // Process the message here (e.g., create or update a user)
        channel.ack(msg);
      }
    });
  }
};

// Start consuming messages after connecting to RabbitMQ
const startConsuming = async () => {
  await connectToRabbitMq();
  consumeFromQueue();
};

// Export the functions as a single object
export { connectToRabbitMq, sendToQueue, startConsuming };
