const express = require('express');
const router = express.Router();
const { getClients, getClientById, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, processAndStoreImage } = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, authorize('Admin'), getClients)
    .post(protect, authorize('Admin'), upload.single('image'), processAndStoreImage('clients'), createClient); // Dedicated client image folder

router.route('/:id')
    .get(protect, authorize('Admin'), getClientById)
    .put(protect, authorize('Admin'), upload.single('image'), processAndStoreImage('clients'), updateClient)
    .delete(protect, authorize('Admin'), deleteClient);

module.exports = router;
