const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post');
const User = mongoose.model('User');

const requireLogin = require('../middleware/requireLogin');

router.get('/api/user/:id', requireLogin, (req, res) => {
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
});

router.put('/api/user/follow',requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followeeId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followeeId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })
    })
})

router.put('/api/user/unfollow',requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followeeId, {
        $pull: {followers: req.user._id}
    },{
        new: true,
    }, (err, result) => {
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.followeeId}
        }, {
            new: true,
        })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            return res.status(422).json({error:err});
        })
    })
        
});

module.exports = router;