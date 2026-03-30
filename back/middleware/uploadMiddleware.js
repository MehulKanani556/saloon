const multer = require('multer');
const sharp = require('sharp');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../config/s3');
require('dotenv').config();

// Storage in memory for processing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Priveleged assets only. Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 5MB limit
});

const processAndStoreImage = (section) => async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `${section}-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;

    // High-fidelity webp compression using Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1200, 800, { fit: 'cover', position: 'center' }) // Optimized viewport sizing
      .webp({ quality: 80, effort: 6 }) // Elite compression level
      .toBuffer();

    // AWS S3 Upload
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${section}/${filename}`,
        Body: processedImage,
        ContentType: 'image/webp',
        ACL: 'public-read' // Assumes bucket allows public-read
      }
    });

    await upload.done();

    // S3 Object URL
    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${section}/${filename}`;

    // Attach dynamic S3 path to request body
    if (section === 'staff' || section === 'clients') {
      req.body.profileImage = s3Url;
    } else {
      req.body.image = s3Url;
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  processAndStoreImage
};
