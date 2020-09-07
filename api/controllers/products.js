const Product = require('../models/products.model');
const mongoose = require('mongoose');

exports.get_all_products = (req, res, next) => {
    Product.find()
    .select('productName productPrice _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.productName,
                    price: doc.productPrice,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Error 500"});
    })
}

exports.post_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productImage: req.file.path
    })
    product
        .save()
        .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Product Successfully Created!",
            productCreated: {
                productName: result.productName,
                productPrice: result.productPrice,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    };

exports.get_productById = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("Data from Database:",doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products"
                    }
                });
            }
            else{
                res.status(404).json({message: "Record Not found of provided product Id!"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    
};

exports.update_productById = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message:"Data Updated!",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/"
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "error occured!"})
        })
};

exports.delete_productById = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product Deleted",
            body: {
                productName: 'String',
                productPrice: 'Number'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Record not found!"});
    });
};