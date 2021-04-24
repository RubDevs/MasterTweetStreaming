const RabbitMQ = require("./index");
const Sentry = require("../utils/sentry");

//Send messages to queue
function sendMessageToQueue(queue, message) {
  return new Promise(async (resolve, reject) => {
    const connection =
      RabbitMQ.RabbitMQ.Connection || (await RabbitMQ.connect());
    if (!RabbitMQ.RabbitMQ.Channel) {
      await RabbitMQ.createChannel(connection);
    }
    RabbitMQ.RabbitMQ.Channel.assertQueue(
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
    RabbitMQ.RabbitMQ.Channel.sendToQueue(queue, Buffer.from(message));
    resolve(true);
    console.log("Mensaje enviado");
  });
}

module.exports = {
  sendMessageToQueue,
};
