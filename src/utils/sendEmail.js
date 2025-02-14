const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },

    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>Email from Devtinder </h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "A text Email through project . working on AMAZON SES ",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Testing Email service",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "devatwork911@gmail.com", //reciever
    "vipul.work28@gmail.com" //sender
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
