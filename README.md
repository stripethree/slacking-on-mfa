# Slacking on MFA

Recently [SendGrid](https://sendgrid.com/) began requiring [two-factor authentication](https://sendgrid.com/docs/ui/account-and-settings/two-factor-authentication/) on all accounts, not allowing users to log in without setting it up. SendGrid only supports two methods for 2FA: a text message (SMS) or an integration with [Authy](https://authy.com/), another service owned by SendGrid parent company [Twilio](https://www.twilio.com/). What is missing is the ability to scan a QR code and use other password managers such as [1Password](https://1password.com/) and [LastPass](https://www.lastpass.com/).

While I understand how SendGrid got to this business decision, as a user with multiple accounts for multiple organizations and projects, this is a severe annoyance. I have multiple accounts forwarding 2FA SMS messages to the same number which is annoying. As many individuals and companies have found out over time, when you make security painful, people find ways around.

The idea behind this very simple server implementation is as followed:
- Use a Twilio phone number as the 2FA number for SendGrid
- Set up a webserver to recieve SMS messages from the Twilio number without responding ((docs)[https://support.twilio.com/hc/en-us/articles/223134127-Receive-SMS-and-MMS-Messages-without-Responding]) and forward them to a [Slack webhook](https://api.slack.com/messaging/webhooks)
- Configure the Twilio number to `POST` to the webserver
  - Go to [Active Numbers](https://www.twilio.com/console/phone-numbers/)
  - Click on the desried number and scoll down to _Messaging_
  - Under _Messaging_, select the _Webhooks ..._ option under _Configure With_
  - Under _A Message Comes In_ select _Webhook_, enter the public URL to the express web application, and select _HTTP POST_

## Local testing

Often times when testing applications like this locally, there is a need for a means to port forward from `localhost` to a public URL so that the webhook works properly. [Twilio's CLI](https://www.twilio.com/docs/twilio-cli/quickstart) leverages [`ngrok`](https://ngrok.com/) to do this with a how to guide provided [here](https://www.twilio.com/docs/labs/serverless-toolkit/developing).

```
npm install -g twilio-cli
twilio phone-numbers:update "+TWILIO-NUMBER" --sms-url="http://localhost:1337/sms"
```