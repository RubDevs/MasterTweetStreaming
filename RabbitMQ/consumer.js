require("dotenv").config();
const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;
const redis = require("../store/redis");
const Sentry = require("../utils/sentry");

function getMessagesFromRabbitMQandSaveToDB(queue) {
  amqp.connect(urlRabbitMQ, (error, connection) => {
    if (error) {
      Sentry.captureException(error);
      return console.error("Connection error: ", error);
    }
    connection.createChannel((error, channel) => {
      if (error) {
        Sentry.captureException(error);
        return console.error("Channel error: ", error);
      }

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.consume(queue, (message) => {
        if (message) {
          const msg = message.content.toString();
          //Save message to redis on list tweets
          redis
            .save("tweets", msg)
            .then((response) => {
              if (response) {
                //if message saved acknowledge RabbitMQ
                console.log("Mensaje Guardado");
                channel.ack(message);
              }
            })
            .catch((error) => {
              Sentry.captureException(error);
            });
        }
      });
    });
  });
}

module.exports = {
  getMessagesFromRabbitMQandSaveToDB,
};
