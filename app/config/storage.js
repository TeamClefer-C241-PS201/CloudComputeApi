const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Creates a client using Google Cloud credentials
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../clefer-423408-a99ea75ab7b6.json'),
  projectId: 'clefer-423408'
});

// Reference to your storage bucket
const bucketName = 'cleferdev';
const bucket = storage.bucket(bucketName);

module.exports = { bucket };
