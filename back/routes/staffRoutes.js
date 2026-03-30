const express = require('express');
const router = express.Router();
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, processAndStoreImage } = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getStaff)
    .post(protect, authorize('Admin'), upload.single('image'), processAndStoreImage('staff'), createStaff);

router.route('/:id')
    .put(protect, authorize('Admin'), upload.single('image'), processAndStoreImage('staff'), updateStaff)
    .delete(protect, authorize('Admin'), deleteStaff);

module.exports = router;
