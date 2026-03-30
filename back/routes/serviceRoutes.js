const express = require('express');
const router = express.Router();
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, processAndStoreImage } = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getServices)
    .post(protect, authorize('Admin'), upload.single('image'), processAndStoreImage('services'), createService);

router.route('/:id')
    .put(protect, authorize('Admin'), upload.single('image'), processAndStoreImage('services'), updateService)
    .delete(protect, authorize('Admin'), deleteService);

module.exports = router;
