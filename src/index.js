const bodyParser = require("body-parser");
const express = require("express");

const { MessagingResponse } = require("twilio").twiml;
const { IncomingWebhook } = require("@slack/webhook");

const { SLACK_WEBHOOK_URL } = process.env;

const app = express();
const debug = require("debug")("slacking-on-mfa");

const slackWebhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/sms", (req, res) => {
  const smsBody = req.body.Body;

  const twiml = new MessagingResponse();

  (async () => {
    await slackWebhook.send({
      text: `Forwarded SMS: ${smsBody}`,
    });
  })();

  res.end(twiml.toString());
});

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 1337;
  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    debug("Server running on port %s", port);
  });
}
