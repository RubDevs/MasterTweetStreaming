const LIST = "tweets";
const start = 1;
const end = 50;

module.exports = function (injectedStore) {
  let store = injectedStore;

  return {
    Tweets: async () => {
      const tweets = await store.list(LIST, start, end);
      return tweets.map((tweet) => {
        return JSON.parse(tweet);
      });
    },
  };
};
