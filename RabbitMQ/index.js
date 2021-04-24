const amqp = require("amqplib/callback_api");
const config = require("../config");
const urlRabbitMQ = config.rabbitMQ.url;
const Sentry = require("../utils/sentry");

const RabbitMQ = {};

function connect() {
  return new Promise((resolve, reject) => {
    if (RabbitMQ.Connection) {
      resolve(RabbitMQ.Connection);
    }
    amqp.connect(urlRabbitMQ, (error, connection) => {
      if (error) {
        return reject(error);
      }
      RabbitMQ.Connection = connection;
      resolve(RabbitMQ.Connection);
    });
  });
}

async function createChannel(connection) {
  RabbitMQ.Channel = await connection.createChannel();
}

module.exports = {
  RabbitMQ,
  connect,
  createChannel,
};
