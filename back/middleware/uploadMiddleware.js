const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const processAndStoreImage = (section) => async (req, res, next) => {
  if (!req.file) return next();

  try {
    const uploadDir = path.join(process.cwd(), 'uploads', section);
    
    // Ensure section-based directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${section}-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    // High-fidelity webp compression using Sharp
    await sharp(req.file.buffer)
      .resize(1200, 800, { fit: 'cover', position: 'center' }) // Optimized viewport sizing
      .webp({ quality: 80, effort: 6 }) // Elite compression level
      .toFile(outputPath);

    // Attach dynamic relative path to request body
    if (section === 'staff' || section === 'clients') {
      req.body.profileImage = `/uploads/${section}/${filename}`;
    } else {
      req.body.image = `/uploads/${section}/${filename}`;
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
