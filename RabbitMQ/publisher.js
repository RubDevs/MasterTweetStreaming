require("dotenv").config();
const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;

//Send messages to queue
function sendMessageToQueue(queue, message) {
  //Create connection to RabbitMQ server
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

      channel.sendToQueue(queue, Buffer.from(message));
      console.log("Mensaje enviado");
    });
  });
}

module.exports = {
  sendMessageToQueue,
};
