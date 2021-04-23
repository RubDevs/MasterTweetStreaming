require("dotenv").config();

module.exports = {
  twitter: {
    BearerToken: process.env.TWITTER_BEARER_TOKEN,
  },
  rabbitMQ: {
    url: process.env.URL_RABBITMQ,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  api: {
    port: process.env.PORT,
  },
};
