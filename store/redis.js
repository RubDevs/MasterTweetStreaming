const redis = require("redis");
const config = require("../config");
const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

function list(list) {
  return new Promise((resolve, reject) => {
    client.lrange(list, 1, 50, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
}

function save(list, data) {
  return new Promise((resolve, reject) => {
    client.lpush(list, data, (error) => {
      if (error) {
        return reject(error);
      }
      resolve(true);
    });
  });
}

module.exports = {
  save,
  list,
};
