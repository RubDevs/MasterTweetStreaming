require("dotenv").config();
const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;

function getMessagesFromRabbitMQ(queue) {
  amqp.connect(urlRabbitMQ, (error, connection) => {
    if (error) {
      return console.error("Connection error: ", error);
    }
    connection.createChannel((error, channel) => {
      if (error) {
        return console.error("Channel error: ", error);
      }

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.consume(queue, (message) => {
        if (message) {
          const msg = message.content.toString();
          console.log(msg);
          channel.ack(message);
        }
      });
    });
  });
}

module.exports = {
  getMessagesFromRabbitMQ,
};
