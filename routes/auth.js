const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../config/secret');

const requireLogin = require('../middleware/requireLogin');

router.post('/signup', (req,res) => {
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password){
        res.status(422).json({error:"Please add all the fields"});
    }
    User.findOne({email: email})
    .then(savedUser => {
        if(savedUser){
            res.status(422).json({error:"User with this email already exists"});
        }
    const user = new User({
        email,
        password,
        name,
        pic
    });

    user.save()
        .then(user => {
            res.status(200).json({message:"User created"});
        }).catch(error => {
            res.status(400).json({message:"Error"});
        })
    }).catch(error => {
        console.log(error);
    })
});

router.post('/signin', (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        res.status(422).json({message: "Username or password missing"});
    }
    User.findOne({email:email})
        .then(savedUser => {
            if(!savedUser){
                res.status(422).json({message: "Username or password invalid"});
            }
            if(password==savedUser.password){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET_KEY);
                const {_id, name, email,followers, following,pic} = savedUser;
                res.json({token,user:{_id,name,email,followers, following,pic}})
            }
            res.status(422).json({message: "Username or password invalid"});
        })
        .catch(error => {
            console.log(error)
        });
});

module.exports = router;