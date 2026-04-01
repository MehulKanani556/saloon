const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('Admin'), createProduct);
router.put('/:id', protect, authorize('Admin'), updateProduct);
router.delete('/:id', protect, authorize('Admin'), deleteProduct);

module.exports = router;
