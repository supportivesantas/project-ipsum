const api_key_mailgun = process.env.MAILGUN_SECRET;
const twilio_SID = process.env.TWILIO_ACCOUNT_SID;
const api_key_twilio = process.env.TWILIO_AUTH_TOKEN;
const mailgun = require('mailgun-js')({ apiKey: api_key_mailgun, domain: 'djdeploy.com' });
// const client = require('twilio')(twilio_SID, api_key_twilio);

const generateEmailMsg = (type, target) => {
  switch (type) {
    case ('servOffline'):
      return {
        from: 'DJ Deploy <me@djdeploy.com>',
        to: target,
        subject: 'Your server may be offline',
        text: 'Check it out',
      };
    case ('ddos'):
      return {
        from: 'DJ Deploy <me@djdeploy.com>',
        to: target,
        subject: 'ATTENTION! DDOS ATTACK PROBABLE!',
        text: 'You\'re getting DDOS\'d probably',
      };
    default:
      return 666;
  }
};

const generateTextMsg = (type) => {
  switch (type) {
    case ('servOffline'):
      return 'Your server is offline';
    case ('ddos'):
      return 'DDOS!!!!! PANIC!!!!!! REPENT!!! REPENT!!!';
    default:
      return 666;
  }
};

const sendEmailMessage = (messageType, email) => {
  const msg = generateEmailMsg(messageType, email);
  if (msg !== 666) {
    mailgun.messages().send(msg, (error, body) => {
      console.log(body);
    });
  }
};


//require the Twilio module and create a REST client

//Send an SMS text message
const sendTextMessage = (messageType, target) => {
  // const msg = generateTextMsg(messageType);
  // console.log(msg);
  // if (msg !== 666) {
  //   client.sendMessage({

  //     to: '+18609213322', // Any number Twilio can deliver to
  //     from: '+18605168237', // A number you bought from Twilio and can use for outbound communication
  //     body: msg, // body of the SMS message

  //   }, (err, responseData) => { //this function is executed when a response is received from Twilio

  //     if (!err) { // "err" is an error received during the request, if any

  //           // "responseData" is a JavaScript object containing data received from Twilio.
  //           // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
  //           // http://www.twilio.com/docs/api/rest/sending-sms#example-1

  //       console.log(responseData.from); // outputs "+14506667788"
  //       console.log(responseData.body); // outputs "word to your mother."

  //     }
  //   });
  // }
};


module.exports = { sendEmailMessage: sendEmailMessage, sendTextMessage: sendTextMessage};
