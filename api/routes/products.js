const express = require('express');
const router = express.Router();
const Product = require('../models/products.model');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = function(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    {
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, limits: 
    {
    fileSize: 1024 * 1024 *5
    },
    fileFilter: fileFilter
});

router.get('/', productController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), productController.post_product);

router.get('/:productId', checkAuth, productController.get_productById);

router.patch('/:productId', checkAuth, productController.update_productById);

router.delete('/:productId', checkAuth, productController.delete_productById);

module.exports = router;