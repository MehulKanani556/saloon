const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const Category = require('../models/Category');
const Service = require('../models/Service');

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (filePath, key) => {
  const fileContent = fs.readFileSync(filePath);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'image/png',
    ACL: 'public-read',
  });
  await s3Client.send(command);
  return `https://${process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Precise paths to generated premium assets
    const images = [
        { path: 'C:/Users/Linux/.gemini/antigravity/brain/2e5754fd-f811-410e-8ee4-3a88ab78c43e/luxury_salon_interior_1774872474708.png', key: 'services/salon_interior_v1.png' },
        { path: 'C:/Users/Linux/.gemini/antigravity/brain/2e5754fd-f811-410e-8ee4-3a88ab78c43e/gold_facial_treatment_1774872496549.png', key: 'services/gold_facial_v1.png' },
        { path: 'C:/Users/Linux/.gemini/antigravity/brain/2e5754fd-f811-410e-8ee4-3a88ab78c43e/hot_stone_massage_1774872515892.png', key: 'services/hot_stone_v1.png' }
    ];

    console.log('Deploying elite assets to AWS S3...');
    const uploadedUrls = [];
    for (const img of images) {
        const url = await uploadToS3(img.path, img.key);
        uploadedUrls.push(url);
    }

    const [salonUrl, facialUrl, massageUrl] = uploadedUrls;

    console.log('Initializing curated Categories...');
    await Category.deleteMany({});
    const categories = await Category.insertMany([
      { name: 'Hair & Scalp' },
      { name: 'Face & Skin' },
      { name: 'Body Relaxation' },
      { name: 'Grooming & Shave' },
      { name: 'Nails & Pedicure' }
    ]);

    console.log('Synchronizing 10 Elite Service Records...');
    await Service.deleteMany({});
    const servicesData = [
      { name: 'Legendary Haircut', category: categories[0]._id, price: 60, duration: 45, image: salonUrl },
      { name: 'Midnight Scalp Massage', category: categories[0]._id, price: 40, duration: 30, image: massageUrl },
      { name: 'Gold Leaf Facial', category: categories[1]._id, price: 120, duration: 60, image: facialUrl },
      { name: 'Charcoal Detox Mask', category: categories[1]._id, price: 50, duration: 20, image: facialUrl },
      { name: 'Deep Tissue Ritual', category: categories[2]._id, price: 150, duration: 90, image: massageUrl },
      { name: 'Hot Stone Therapy', category: categories[2]._id, price: 180, duration: 75, image: massageUrl },
      { name: 'Imperial Shave', category: categories[3]._id, price: 45, duration: 30, image: salonUrl },
      { name: 'Beard Sculpting', category: categories[3]._id, price: 35, duration: 20, image: salonUrl },
      { name: 'Royal Pedicure', category: categories[4]._id, price: 55, duration: 45, image: massageUrl },
      { name: 'Champagne Manicure', category: categories[4]._id, price: 50, duration: 40, image: massageUrl }
    ];

    await Service.insertMany(servicesData);
    console.log('Data Synchronicity Established: 5 Categories and 10 Premium Services configured.');
    process.exit(0);
  } catch (err) {
    console.error('Data seeding sequence failed:', err);
    process.exit(1);
  }
};

seed();
