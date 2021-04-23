const LIST = "tweets";
const start = 1;
const end = 50;

//Dependency Injection
module.exports = function (injectedStore) {
  let store = injectedStore;

  async function list() {
    return store.list(LIST, start, end);
  }

  //Exposed functions
  return {
    list,
  };
};
