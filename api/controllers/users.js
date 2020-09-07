const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "Email Exists!"
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err){
                        return res.status(500).json({
                            error: err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(200).json({
                                    message: "New User Created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                }); 
            }
        })
    };

exports.logIn = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(401).json({
                    message: "Authentication failed!"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Authentication Failed!"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    "secret",
                    {
                        expiresIn: "1h"
                    }
                    )
                    return res.status(200).json({
                        message: "Authentication Successful.",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Authentication Failed!"
                })
            })
        })
        .catch(err => {
            console.log(err)
           res.status(500).json({
               message: "Auth Failed!"
           });
        });
};

exports.delete_user = (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message:"User Deleted!"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};