require("dotenv").config();
const express = require("express");

const config = require("./config");
const APItweet = require("./api/components/tweet/network");
const errors = require("./network/errors");
const Twitter = require("./tweets");
const Publisher = require("./RabbitMQ/publisher");
const Consumer = require("./RabbitMQ/consumer");
const Sentry = require("./utils/sentry");
const redis = require("./store/redis");

async function getTweetsAndSendToRabbitMQ() {
  const stream = await Twitter.startStreaming();
  //When a tweet is received
  stream.on("data", (data) => {
    try {
      const tweet = JSON.parse(data);
      //extract only relevant information from tweet
      const tweetData = {
        id: tweet.data.id,
        text: tweet.data.text,
        username: `@${tweet.includes.users[0].username}`,
        link: `https://twitter.com/${tweet.includes.users[0].username}/status/${tweet.data.id}`,
      };
      //Send the tweet to RabbitMQ
      Publisher.sendMessageToQueue("tweets", JSON.stringify(tweetData));
      //Get tweets and save them
      getTweetsFromRabbitMQandSaveToDB("tweets");
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error: ", error.message);
    }
  });

  //when an error occurs while streaming tweets
  stream.on("error", (error) => {
    Sentry.captureException(error);
    console.error(error);
  });
}

async function getTweetsFromRabbitMQandSaveToDB(queue) {
  const tweet = await Consumer.getMessagesFromRabbitMQ(queue);
  if (tweet) {
    await redis.save("tweets", tweet);
    console.log("Mensaje guardado");
  }
}

getTweetsAndSendToRabbitMQ();

const app = express();

//middleware
app.use(express.json());

//router
app.use("/tweets", APItweet);
app.use(errors);

app.listen(process.env.PORT || config.api.port, () => {
  console.log(`API listening on port: ${config.api.port}`);
});
