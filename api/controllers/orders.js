const Order = require('../models/order.model');
const Product = require('../models/products.model');
const mongoose = require('mongoose');

exports.order_get_all = (req, res, next) => {
    Order.find()
    .populate('product', 'productName')
    .then(results => {
        res.status(200).json({
            count: results.length,
            orders: results.map(result => {
                return {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + result._id
                    }
                }
            }),
            
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Error while fetching!"
        })
    })
};

exports.post_orders = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product Not found!"
            });
        }
        const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    return order.save()
})
    .then(result => {
        return res.status(201).json({
            message:"Order Placed",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            message: "Error occured"
        });
    });
}

exports.get_orderById = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .then(result => {
        if (!result) {
            return res.status(404).json({
                message: "Order Not Found!"
            });
        }
        return res.status(200).json({
            order: result,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders"
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.update_orderById = (req, res, next) => {
    return res.status(200).json({
        message: 'Orders discovered with Id!',
        id: req.params.orderId
    });
};

exports.delete_orderById = (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(result => {
        return res.status(200).json({
            message: "Order Deleted!",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders/",
                body: {productId: "ID", quantity: "Number"}
            }
        })
    })
    .catch(err => {
       return res.status(500).json({
            error: err
        })
    })
};