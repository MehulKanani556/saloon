const express = require('express');
const router = express.Router();
const { getDashboardInsights } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin'), getDashboardInsights);

module.exports = router;
