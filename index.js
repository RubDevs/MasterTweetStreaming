require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const config = require("./config");
const APItweet = require("./api/components/tweet/network");
const errors = require("./network/errors");
const Twitter = require("./tweets");
const Publisher = require("./RabbitMQ/publisher");
const Consumer = require("./RabbitMQ/consumer");
const Sentry = require("./utils/sentry");
const redis = require("./store/redis");
const schema = require("./graphQL/schema");
const resolvers = require("./graphQL/");

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
  const connection = await Consumer.connect();
  const channel = await Consumer.getChannel(connection);
  await Consumer.assertQueue(channel, queue);

  channel.consume(queue, async (message) => {
    const tweet = message.content.toString();
    if (tweet) {
      await redis.save("tweets", tweet);
      console.log("Mensaje guardado");
    }
    //Acknowledge RabbitMQ
    channel.ack(message);
  });
}

getTweetsAndSendToRabbitMQ();
getTweetsFromRabbitMQandSaveToDB("tweets");

const app = express();

//middleware
app.use(express.json());

//router
APItweet(app);
app.use(
  "/graphql",
  graphqlHTTP({ schema, rootValue: resolvers, graphiql: true })
);
app.use(errors);

app.listen(process.env.PORT || config.api.port, () => {
  console.log(`API listening on port: ${config.api.port}`);
});
