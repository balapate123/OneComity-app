const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadToS3 = async (file) => {
  
  try {
    console.log('📥 Starting S3 upload for file:', file.originalname);
    const key = `profile-pics/${Date.now()}-${file.originalname}`;
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: 'image/jpeg'
    };

    console.log('📡 Uploading to S3 with key:', key);

    const data = await s3.upload(params).promise();

    console.log('✅ S3 upload complete:');

    return data.Location;
  } catch (err) {
    console.error('💥 S3 upload error:', err);
    throw err;
  }
};

// 🧼 Delete from S3 by Key
exports.deleteFromS3 = async (fileUrl) => {
  if (!fileUrl) return;

  const bucketName = process.env.AWS_BUCKET_NAME;
  const urlParts = fileUrl.split('/');
  const key = urlParts.slice(3).join('/'); // removes https://s3-region.amazonaws.com/bucket-name/

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  await s3.deleteObject(params).promise();
};
