// test-s3-upload.js
require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const fileContent = Buffer.from('Captain test file!');
const key = `profile-pics/test-upload-${Date.now()}.txt`;

const params = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: key,
  Body: fileContent,
  ContentType: 'text/plain',
  //ACL: 'public-read',
};

console.log('🚀 Testing direct upload to S3...');
s3.upload(params, (err, data) => {
  if (err) {
    console.error('❌ Upload failed:', err.message);
  } else {
    console.log('✅ Upload success! File available at:', data.Location);
  }
});
