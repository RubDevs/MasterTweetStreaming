require("dotenv").config();
const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;
const redis = require("../store/redis");
const Sentry = require("../utils/sentry");

function getMessagesFromRabbitMQ(queue) {
  return new Promise((resolve, reject) => {
    amqp.connect(urlRabbitMQ, (error, connection) => {
      if (error) {
        Sentry.captureException(error);
        return reject(error);
      }
      connection.createChannel((error, channel) => {
        if (error) {
          Sentry.captureException(error);
          return reject(error);
        }

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.consume(queue, (message) => {
          if (message) {
            const msg = message.content.toString();
            //Acknowledge RabbitMQ
            channel.ack(message);
            resolve(msg);
          }
        });
      });
    });
  });
}

module.exports = {
  getMessagesFromRabbitMQ,
};
