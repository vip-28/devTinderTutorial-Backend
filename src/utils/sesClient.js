const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "eu-north-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
module.exports = { sesClient };

// const s3Client = new S3Client({
//     region: process.env.AWS_REGION,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     });
