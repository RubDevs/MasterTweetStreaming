const tweetsMock = require("../mocks/Tweets");

//Get
function list(list, start, end) {
  return new Promise((resolve, reject) => {
    resolve(tweetsMock);
  });
}

function save(list, data) {
  return new Promise((resolve, reject) => {
    resolve(tweetsMock.push(data));
  });
}

module.exports = {
  save,
  list,
};
