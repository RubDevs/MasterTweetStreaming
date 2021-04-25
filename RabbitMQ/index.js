const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;
const Sentry = require("../utils/sentry");

const RabbitMQ = {};

function connect(mode) {
  return new Promise((resolve, reject) => {
    amqp.connect(urlRabbitMQ, (error, connection) => {
      if (error) {
        return reject(error);
      }
      if (mode == "publisher") {
        RabbitMQ.publisherConnection = connection;
        resolve(RabbitMQ.publisherConnection);
      } else {
        RabbitMQ.consumerConnection = connection;
        resolve(RabbitMQ.consumerConnection);
      }
    });
  });
}

async function createChannel(connection, mode) {
  if (mode == "publisher") {
    RabbitMQ.publisherChannel = await connection.createChannel();
  } else {
    RabbitMQ.consumerChannel = await connection.createChannel();
  }
}

module.exports = {
  RabbitMQ,
  connect,
  createChannel,
};
