const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3');
require('dotenv').config();

/**
 * Extracts the S3 Key from a full S3 URL.
 * @param {string} url - The full S3 URL of the object.
 * @returns {string|null} - The S3 key or null if not an S3 URL.
 */
const extractS3Key = (url) => {
  if (!url || !url.includes('amazonaws.com')) return null;
  
  // URL format: https://bucket-name.s3.region.amazonaws.com/folder/filename.ext
  try {
    const urlObj = new URL(url);
    const key = urlObj.pathname.substring(1); // Remove leading slash
    return key;
  } catch (err) {
    console.error('Error parsing S3 URL:', err);
    return null;
  }
};

/**
 * Deletes an object from S3 based on its URL.
 * @param {string} url - The S3 URL of the object.
 */
const deleteFromS3 = async (url) => {
  const key = extractS3Key(url);
  if (!key) return;

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    console.log(`Successfully deleted ${key} from S3.`);
  } catch (err) {
    console.error(`Error deleting ${key} from S3:`, err);
  }
};

module.exports = {
  extractS3Key,
  deleteFromS3
};
