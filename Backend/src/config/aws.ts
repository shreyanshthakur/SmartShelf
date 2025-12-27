import { S3Client } from "@aws-sdk/client-s3";

console.log("AWS Configuration Debug:");
console.log("Region:", process.env.AWS_REGION);
console.log(
  "Access Key ID:",
  process.env.AWS_ACCESS_KEY_ID ? "✓ Set" : "✗ Missing"
);
console.log(
  "Secret Access Key:",
  process.env.AWS_SECRET_ACCESS_KEY ? "✓ Set" : "✗ Missing"
);
console.log("Bucket Name:", process.env.S3_BUCKET_NAME);
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default s3Client;
