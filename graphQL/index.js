const resolvers = require("./resolvers");
const config = require("../config");

let store;

//Choose DB according to environment
if (config.dev) {
  //Dummy when development
  store = require("../store/redis");
} else {
  //redis when production
  store = require("../store/redis");
}

//Dependency Injection
module.exports = resolvers(store);
