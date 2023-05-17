const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const protectedSource = require('../middleware/protectedSource');
const PostModel = mongoose.model("PostModel");
const UserModel = mongoose.model("UserModel");

//endpoint to get user details of another user(not the loggedin user) along with their posts
router.get('/user/:userId', protectedSource, (req, res) => {
    //to find the specific user
    UserModel.findOne({ _id: req.params.userId })
        .select("-password")//fetche everything except password
        .then((userFound) => {
            //fetch all posts of this found user
            PostModel.find({ author: req.params.userId })
                .populate("author", "_id fullName")
                .exec((eror, allPosts) => {
                    if (eror) {
                        return res.status(400).json({ error: eror });
                    }
                    res.json({ user: userFound, posts: allPosts })
                })
        })
        .catch((error) => {
            return res.status(400).json({ error: "User was not found!" })
        })
});
router.put('/follow',protectedSource,(req,res)=>{
    UserModel.findByIdAndUpdate(req.body.followId,{
      $push:{followers:req.dbUser._id}
    },{
        new :true
    },(error,result)=>{
        if(error){
            return res.status(400).json({error:error})
        }
        UserModel.findByIdAndUpdate(req.dbUser._id,{
            $push:{following:req.body.followId}
        },{new :true})
        .select("-password")
        .then((result)=>res.json(result))
    .catch((error)=>{ return res.status(400).json({error:error})})

    })
    
});
router.put('/unfollow',protectedSource,(req,res)=>{
    UserModel.findByIdAndUpdate(req.body.unfollowId,{
      $pull:{followers:req.dbUser._id}
    },{
        new :true
    },(error,result)=>{
        if(error){
            return res.status(400).json({error:error})
        }
        UserModel.findByIdAndUpdate((req.dbUser._id),{
            $pull:{following:req.body.unfollowId}
        },{new :true})
        .select("-password")
        .then((result)=>res.json(result))
        .catch((error)=>{ return res.status(400).json({error:error})})

    })
   
});
module.exports=router;