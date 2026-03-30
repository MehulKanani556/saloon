const express = require('express');
const router = express.Router();
const { generateInvoicePDF } = require('../controllers/invoiceController');

// @route   GET /api/invoices/export-pdf/:id
// @desc    Export Appointment Invoice as PDF
// @access  Public (Can be protected with middleware if needed)
router.get('/export-pdf/:id', generateInvoicePDF);

module.exports = router;
