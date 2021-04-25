require("dotenv").config();
const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;
const RabbitMQ = require("./index");
const redis = require("../store/redis");
const Sentry = require("../utils/sentry");

function getMessagesFromRabbitMQ(queue) {
  return new Promise(async (resolve, reject) => {
    const connection =
      RabbitMQ.RabbitMQ.consumerConnection ||
      (await RabbitMQ.connect("consumer"));
    if (!RabbitMQ.RabbitMQ.consumerChannel) {
      await RabbitMQ.createChannel(connection, "consumer");
    }
    RabbitMQ.RabbitMQ.consumerChannel.assertQueue(
      queue,
      { durable: false },
      (error, ok) => {
        if (error) {
          Sentry.captureException(error);
          console.error("Error asserting queue: ", error);
          return reject(error);
        }
      }
    );
    RabbitMQ.RabbitMQ.consumerChannel.consume(queue, (message) => {
      if (message) {
        const msg = message.content.toString();
        //Acknowledge RabbitMQ
        RabbitMQ.RabbitMQ.consumerChannel.ack(message);
        resolve(msg);
      }
    });
  });
}

module.exports = {
  getMessagesFromRabbitMQ,
};
