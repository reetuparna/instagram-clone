const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../config/secret');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req,res,next) => {
    const {authorization} = req.headers;
    if (!authorization){
        res.status(401).json({error: 'please login first'});
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
        if(err){
            res.status(401).json({error: "Please login first"});
        }
        const {_id} = payload;
        User.findById(_id).then(savedUser => {
            req.user = savedUser;
            next();
        });
        
    })
}