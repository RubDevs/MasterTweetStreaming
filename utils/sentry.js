const config = require("../config");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

module.exports = Sentry;
