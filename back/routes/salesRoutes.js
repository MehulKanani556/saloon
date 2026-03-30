const express = require('express');
const router = express.Router();
const { getFinancialMatrix } = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/matrix', protect, authorize('Admin'), getFinancialMatrix);

module.exports = router;
