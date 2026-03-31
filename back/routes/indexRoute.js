const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');
const serviceController = require('../controllers/serviceController');
const staffController = require('../controllers/staffController');
const clientController = require('../controllers/clientController');
const salesController = require('../controllers/salesController');
const settingController = require('../controllers/settingController');
const dashboardController = require('../controllers/dashboardController');
const categoryController = require('../controllers/categoryController');
const invoiceController = require('../controllers/invoiceController');
const reportsController = require('../controllers/reportsController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, processAndStoreImage } = require('../middleware/uploadMiddleware');

// ==========================================
// AUTH ROUTES
// ==========================================
router.post('/auth/register', authController.registerUser);
router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/login', authController.loginUser);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logoutUser);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/profile', protect, upload.single('image'), processAndStoreImage('profile pic'), authController.updateUserProfile);
router.put('/auth/change-password', protect, authController.changePassword);
router.delete('/auth/profile', protect, authController.softDeleteUser);

// ==========================================
// APPOINTMENT ROUTES
// ==========================================
router.get('/appointments/my', protect, appointmentController.getMyAppointments);
router.get('/appointments', protect, authorize('Admin'), appointmentController.getAppointments);
router.get('/appointments/occupied-slots', appointmentController.getOccupiedSlots);
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id', protect, authorize('Admin'), appointmentController.updateAppointment);
router.delete('/appointments/:id', protect, authorize('Admin'), appointmentController.deleteAppointment);
router.put('/appointments/:id/status', protect, authorize('Admin'), appointmentController.updateAppointmentStatus);

// ==========================================
// SERVICE ROUTES
// ==========================================
router.get('/services', serviceController.getServices);
router.post('/services', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('services'), serviceController.createService);
router.put('/services/:id', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('services'), serviceController.updateService);
router.delete('/services/:id', protect, authorize('Admin'), serviceController.deleteService);

// ==========================================
// STAFF ROUTES
// ==========================================
router.get('/staff', staffController.getStaff);
router.post('/staff', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('staff'), staffController.createStaff);
router.put('/staff/:id', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('staff'), staffController.updateStaff);
router.delete('/staff/:id', protect, authorize('Admin'), staffController.deleteStaff);

// ==========================================
// CLIENT ROUTES
// ==========================================
router.get('/clients', protect, authorize('Admin'), clientController.getClients);
router.post('/clients', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('clients'), clientController.createClient);
router.get('/clients/:id', protect, authorize('Admin'), clientController.getClientById);
router.put('/clients/:id', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('clients'), clientController.updateClient);
router.delete('/clients/:id', protect, authorize('Admin'), clientController.deleteClient);

// ==========================================
// SALES ROUTES
// ==========================================
router.get('/sales/matrix', protect, authorize('Admin'), salesController.getFinancialMatrix);
router.post('/sales/withdraw', protect, authorize('Admin'), salesController.processWithdrawal);

// ==========================================
// SETTINGS ROUTES
// ==========================================
router.get('/settings', settingController.getSettings);
router.put('/settings', protect, authorize('Admin'), settingController.updateSettings);

// ==========================================
// DASHBOARD ROUTES
// ==========================================
router.get('/dashboard', protect, authorize('Admin'), dashboardController.getDashboardInsights);

// ==========================================
// CATEGORY ROUTES
// ==========================================
router.get('/categories', categoryController.getCategories);
router.post('/categories', protect, authorize('Admin'), categoryController.createCategory);
router.put('/categories/:id', protect, authorize('Admin'), categoryController.updateCategory);
router.delete('/categories/:id', protect, authorize('Admin'), categoryController.deleteCategory);

// ==========================================
// INVOICE ROUTES
// ==========================================
router.get('/invoices/export-pdf/:id', protect, authorize('Admin'), invoiceController.generateInvoicePDF);

// ==========================================
// REPORTS ROUTES
// ==========================================
router.get('/reports/intel', protect, authorize('Admin'), reportsController.getReportIntel);

module.exports = router;
