const multer = require('multer');
const storage = multer.memoryStorage(); // Keep in memory for S3 upload
const upload = multer({ storage });
module.exports = upload;
