const response = require("../../../network/reponse");
const express = require("express");
const Controller = require("./index");

const router = express.Router();

router.get("/", list);

//Internal middleware
async function list(req, res, next) {
  Controller.list()
    .then((tweets) => {
      response.success(req, res, tweets, 200);
    })
    .catch(next);
}

module.exports = router;
