const express = require("express");

const expect = require("chai").expect;
const tweetAPI = require("../api/components/tweet/network");
const testServer = require("../utils/testServer");
const assert = require("assert");

describe("GET /tweets", () => {
  const request = testServer(tweetAPI);

  it("Should respond with status 200", (done) => {
    request.get("/tweets").expect(200, done);
  });

  it("Should respond with no error", (done) => {
    request.get("/tweets").end((error, response) => {
      assert.strictEqual(error, null);
      done();
    });
  });

  it("Should responds with 50 tweets", function (done) {
    request.get("/tweets").end((error, response) => {
      expect(response.body.length, 50);
      done();
    });
  });
});
