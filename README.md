# MasterTweetStreaming

MasterTweetStreaming is an application to:
- Consuming Tweets filtered by keywords from Twitter's API
- Sending the Tweets to a RabbitMQ queue
- Consuming the Tweets from the queue and save them to a Redis Database
- Expose a REST API to consume the saved Tweets 


## API Reference

#### Get last saved Tweets (50)

```http
  GET /tweets
```



  
## Authors

- [@RubDevs](https://www.github.com/RubDevs)

  
## Contributing

1. Fork it (<https://github.com/RubDevs/MasterTweetStreaming/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

  
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`TWITTER_BEARER_TOKEN`

`URL_RABBITMQ`

`REDIS_HOST`

`REDIS_PORT`

`REDIS_PASSWORD`

`PORT`

`SENTRY_DSN`
