require("dotenv").config();
const express = require("express");

const config = require("./config");
const APItweet = require("./api/components/tweet/network");
const errors = require("./network/errors");
const Twitter = require("./tweets");
const Publisher = require("./RabbitMQ/publisher");
const Consumer = require("./RabbitMQ/consumer");

async function getTweetsAndSendToRabbitMQ() {
  const stream = await Twitter.startStreaming();
  stream.on("data", (data) => {
    const tweet = JSON.parse(data);
    const tweetData = {
      id: tweet.data.id,
      text: tweet.data.text,
      username: `@${tweet.includes.users[0].username}`,
      link: `https://twitter.com/${tweet.includes.users[0].username}/status/${tweet.data.id}`,
    };
    Publisher.sendMessageToQueue("tweets", JSON.stringify(tweetData));
  });
}

async function getTweetsFromRabbitMQandSaveToDB(queue) {
  Consumer.getMessagesFromRabbitMQandSaveToDB(queue);
}

getTweetsAndSendToRabbitMQ();
getTweetsFromRabbitMQandSaveToDB("tweets");

const app = express();

//middleware
app.use(express.json());

//router
app.use("/tweets", APItweet);
app.use(errors);

app.listen(process.env.PORT || config.api.port, () => {
  console.log(`API listening on port: ${config.api.port}`);
});
