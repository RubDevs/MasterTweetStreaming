require("dotenv").config();
const needle = require("needle");
const config = require("../config");

const TOKEN = config.twitter.BearerToken;

//URL to stablish rules to streamed tweets
const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id";

//Rules, keywords to listen
const rules = [{ value: "platzi" }, { value: "nodejs" }];

//Get stream rules
async function getRules() {
  const response = await needle("get", rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

//Set stream rules
async function setRules() {
  const data = {
    add: rules,
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

//Delete stream rules
async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) {
    return null;
  }

  //Get an array of rules IDs
  const ids = rules.data.map((rule) => {
    rule.id;
  });

  const data = {
    delete: {
      ids: ids,
    },
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.body;
}

//Get stream of filtered Tweets
function streamTweets() {
  const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return stream;
}

//Start to stream Tweets
async function startStreaming() {
  let currentRules;
  try {
    currentRules = await getRules();

    await deleteRules(currentRules);

    await setRules();
  } catch (error) {
    console.error(error);
  }
  return streamTweets();
}

module.exports = {
  startStreaming,
};
