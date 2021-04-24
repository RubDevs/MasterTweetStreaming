require("dotenv").config();
const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;
const Sentry = require("../utils/sentry");

//Send messages to queue
function sendMessageToQueue(queue, message) {
  //Create connection to RabbitMQ server
  amqp.connect(urlRabbitMQ, (error, connection) => {
    if (error) {
      Sentry.captureException(error);
      console.error("Connection error: ", error);
      return error;
    }
    connection.createChannel((error, channel) => {
      if (error) {
        Sentry.captureException(error);
        console.error("Channel error: ", error);
        return error;
      }

      channel.assertQueue(
        queue,
        {
          durable: false,
        },
        (error, ok) => {
          if (error) {
            Sentry.captureException(error);
            console.error("Error asserting queue: ", error);
            return error;
          }
        }
      );

      channel.sendToQueue(queue, Buffer.from(message));
      console.log("Mensaje enviado");
    });
  });
}

module.exports = {
  sendMessageToQueue,
};
