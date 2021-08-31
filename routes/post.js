const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post');

const requireLogin = require('../middleware/requireLogin')

router.post('/api/createPost', requireLogin, (req, res) => {
    console.log(req.body)
    const {caption, url} = req.body;
    if(!url){
        res.status(422).json({error: 'Please add a photo'});
    }
    console.log(req.user);
    const post = new Post({
        caption,
        url,
        postedBy: req.user,
    });
    post.save().then(result => {
        res.json({post:result});
    }).catch(err => {
        console.log(err);
    });
});

router.get('/api/allPosts', requireLogin, (req, res) => {
    Post.find()
        .populate('postedBy', '_id name pic')
        .populate('comments.postedBy', '_id name')
        .sort('-createdAt')
        .then(posts => {
            res.json({posts});
        }).catch(err => {
            console.log(err);
        });
});

router.get('/api/myPosts', requireLogin, (req, res) => {
    Post.find({postedBy:req.user._id})
        .populate("postedBy", "_id name")
        .sort('-createdAt')
        .then(myPosts => {
            res.json({myPosts});
        }).catch(err => {
            console.log(err);
        })
});

router.put('/api/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes:req.user._id}
    }, {
        new: true
    }).exec((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    })
});

router.put('/api/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes:req.user._id}
    }, {
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error:err})
        } else {
            return res.json(result)
        }
    })
});

router.put('/api/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id,
    };
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    }, {
        new: true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err, result) => {
        if(err){
            res.status(422).json({error:err});
        } else {
            res.json(result);
        }
    })
});

router.delete('/api/delete/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
});

router.get('/api/subposts', requireLogin, (req, res) => {
    Post.find({postedBy: {$in: req.user.following}})
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name pic')
        .sort('-createdAt')
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
});

module.exports = router;