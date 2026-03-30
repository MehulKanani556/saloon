const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.route('/')
    .get(getAppointments)
    .post(createAppointment);

router.route('/:id')
    .put(updateAppointment)
    .delete(deleteAppointment);

router.put('/:id/status', updateAppointmentStatus);

module.exports = router;
