const amqp = require("amqplib");

const QUEUE_NAME = "notifications";

// Setup connection and channel
const setupQueue = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost"); // Use default RabbitMQ URL
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true }); // Durable queue to persist messages
    return { connection, channel };
  } catch (error) {
    console.error("Error setting up RabbitMQ:", error);
    throw error;
  }
};

// Send a message to the queue
const sendToQueue = async (message) => {
  try {
    const { channel } = await setupQueue();
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true, // Persist messages to survive broker restarts
    });
    console.log("Message sent to queue:", message);
  } catch (error) {
    console.error("Error sending to queue:", error);
    throw error;
  }
};

// Consume messages from the queue
const consumeQueue = async (callback) => {
  try {
    const { connection, channel } = await setupQueue();
    channel.prefetch(1); // Process one message at a time
    console.log("Waiting for messages in queue:", QUEUE_NAME);
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        try {
          await callback(message);
          channel.ack(msg); // Acknowledge the message
        } catch (error) {
          console.error("Error processing message:", error);
          channel.nack(msg, false, true); // Requeue the message on failure
        }
      }
    });
  } catch (error) {
    console.error("Error consuming from queue:", error);
    throw error;
  }
};

module.exports = { sendToQueue, consumeQueue };
