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
const leaveController = require('../controllers/leaveController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');

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
router.get('/appointments', protect, authorize('Admin', 'Staff'), appointmentController.getAppointments);
router.post('/appointments/occupied-slots', appointmentController.getOccupiedSlots);
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id', protect, authorize('Admin', 'Staff'), appointmentController.updateAppointment);
router.delete('/appointments/:id', protect, authorize('Admin', 'Staff', 'User'), appointmentController.deleteAppointment);
router.put('/appointments/:id/status', protect, authorize('Admin', 'Staff'), appointmentController.updateAppointmentStatus);

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
router.get('/clients', protect, authorize('Admin', 'Staff'), clientController.getClients);
router.post('/clients', protect, authorize('Admin', 'Staff'), upload.single('image'), processAndStoreImage('clients'), clientController.createClient);
router.get('/clients/:id', protect, authorize('Admin', 'Staff'), clientController.getClientById);
router.put('/clients/:id', protect, authorize('Admin', 'Staff'), upload.single('image'), processAndStoreImage('clients'), clientController.updateClient);
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
router.get('/dashboard', protect, authorize('Admin', 'Staff'), dashboardController.getDashboardInsights);

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
router.get('/invoices/export-pdf/:id', protect, authorize('Admin', 'Staff'), invoiceController.generateInvoicePDF);

// ==========================================
// REPORTS ROUTES
// ==========================================
router.get('/reports/intel', protect, authorize('Admin'), reportsController.getReportIntel);

// ==========================================
// LEAVE ROUTES
// ==========================================
router.post('/leaves', protect, authorize('Staff'), leaveController.applyLeave);
router.get('/leaves/my', protect, authorize('Staff'), leaveController.getMyLeaves);
router.get('/leaves', protect, authorize('Admin'), leaveController.getAllLeaves);
router.put('/leaves/:id', protect, authorize('Admin'), leaveController.updateLeaveStatus);

// ==========================================
// SPECIALIZATION REQUEST ROUTES
// ==========================================
const specializationController = require('../controllers/specializationController');
router.post('/specializations/requests', protect, authorize('Staff'), specializationController.createSpecializationRequest);
router.get('/specializations/my-requests', protect, authorize('Staff'), specializationController.getMySpecializationRequests);
router.get('/specializations/all-requests', protect, authorize('Admin'), specializationController.getAllSpecializationRequests);
router.put('/specializations/requests/:id', protect, authorize('Admin'), specializationController.updateSpecializationRequestStatus);
// PRODUCT ROUTES
// ==========================================
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products/:id/reviews', protect, productController.createProductReview);
router.post('/products', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('products'), productController.createProduct);
router.put('/products/:id', protect, authorize('Admin'), upload.single('image'), processAndStoreImage('products'), productController.updateProduct);
router.delete('/products/:id', protect, authorize('Admin'), productController.deleteProduct);

// ==========================================
// ORDER ROUTES
// ==========================================
router.post('/orders', protect, orderController.createOrder);
router.get('/orders/my', protect, orderController.getMyOrders);
router.get('/orders', protect, authorize('Admin'), orderController.getOrders);
router.put('/orders/:id/status', protect, authorize('Admin'), orderController.updateOrderStatus);
router.put('/orders/:id/cancel', protect, orderController.cancelOrder);

// ==========================================
// PAYMENT ROUTES
// ==========================================
router.post('/payment/create-payment-intent', protect, paymentController.createPaymentIntent);

// ==========================================
// WEBHOOK ROUTES (Requires Raw Body Parsing)
// ==========================================
const webhookController = require('../controllers/webhookController');
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), webhookController.handleStripeWebhook);

// ==========================================
// RATING & REVIEW SYSTEM ROUTES
// ==========================================
const reviewController = require('../controllers/reviewController');
router.post('/reviews', protect, reviewController.createReview);
router.get('/reviews/:targetId', reviewController.getReviews);

// ==========================================
// CART & WISHLIST PERSISTENCE ROUTES
// ==========================================
const cartController = require('../controllers/cartController');
const wishlistController = require('../controllers/wishlistController');
router.get('/cart', protect, cartController.getCart);
router.post('/cart/sync', protect, cartController.syncCart);
router.get('/wishlist', protect, wishlistController.getWishlist);
router.post('/wishlist/sync', protect, wishlistController.syncWishlist);

module.exports = router;
