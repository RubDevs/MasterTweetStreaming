const RabbitMQ = require("./index");

async function connect() {
  try {
    const connection =
      RabbitMQ.RabbitMQ.consumerConnection ||
      (await RabbitMQ.connect("consumer"));
    return connection;
  } catch (error) {
    console.error("error getting connection: ", error);
    return error;
  }
}

async function getChannel(connection) {
  try {
    const channel =
      RabbitMQ.RabbitMQ.consumerChannel ||
      (await RabbitMQ.createChannel(connection, "consumer"));
    return RabbitMQ.RabbitMQ.consumerChannel;
  } catch (error) {
    console.error("Error getting channel: ", error);
    return error;
  }
}

async function assertQueue(channel, queue) {
  try {
    channel.assertQueue(queue, { durable: true });
  } catch (error) {
    console.error("Error asserting queue: ", error);
    return error;
  }
}

module.exports = {
  connect,
  getChannel,
  assertQueue,
};
