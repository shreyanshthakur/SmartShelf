import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-2",
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {
    Bucket: process.env.S3_BUCKET_NAME,
  },
});

export default s3;
