const RabbitMQ = require("./index");
const Sentry = require("../utils/sentry");

//Send messages to queue
function sendMessageToQueue(queue, message) {
  return new Promise(async (resolve, reject) => {
    const connection =
      RabbitMQ.RabbitMQ.publisherConnection ||
      (await RabbitMQ.connect("publisher"));
    if (!RabbitMQ.RabbitMQ.publisherChannel) {
      await RabbitMQ.createChannel(connection, "publisher");
    }
    RabbitMQ.RabbitMQ.publisherChannel.assertQueue(
      queue,
      { durable: true },
      (error, ok) => {
        if (error) {
          Sentry.captureException(error);
          console.error("Error asserting queue: ", error);
          return reject(error);
        }
      }
    );
    RabbitMQ.RabbitMQ.publisherChannel.sendToQueue(queue, Buffer.from(message));
    resolve(true);
    console.log("Mensaje enviado");
  });
}

module.exports = {
  sendMessageToQueue,
};
