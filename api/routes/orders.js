const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/products.model');
const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/orders');

router.get('/', checkAuth, orderController.order_get_all);

router.post('/', checkAuth, orderController.post_orders);

router.get('/:orderId', checkAuth, orderController.get_orderById);

router.patch('/:orderId', checkAuth, orderController.update_orderById);

router.delete('/:orderId', checkAuth, orderController.delete_orderById);

module.exports = router;