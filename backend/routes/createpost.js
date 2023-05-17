const { compare } = require('bcrypt');
const express = require('express');
const router=express.Router();
const mongoose=require('mongoose');
const PostModel=mongoose.model('PostModel');
const protectedSource = require('../middleware/protectedSource');
router.get('/posts',protectedSource,(req,res)=>{
     PostModel.find()
     .populate("author","_id fullName profilePicUrl")
     .populate("comments.commentedBy","_id fullName profilePicUrl")
     .then((dbPosts)=>{
        res.status(201).json({posts:dbPosts})}
     )
     .catch(error=>{console.log(error)});
});
router.get('/myposts',protectedSource,(req,res)=>{
    PostModel.find({author:req.dbUser._id})
    .populate("author","_id fullName profilePicUrl")
    .populate("comments.commentedBy","_id fullName profilePicUrl")
    .then((dbPosts)=>{
       res.status(201).json({posts:dbPosts})}
    )
    .catch(error=>{console.log(error)});
});
router.post('/createpost',protectedSource,(req,res)=>{
    const {title,body,image} = req.body;
    if(!title || !body || !image){
        return   res.status(400).json({error:"one or more mandatory field is missing"});
    }
   /* console.log(req.dbUser);
    res.send("done");*/
    req.dbUser.password=undefined;
    const post=new PostModel({title:title,body:body,image:image,author:req.dbUser});
    post.save()
    .then((dbPost)=>{
        res.status(201).json({post:dbPost})
    }
      
    )
    .catch((error)=>
    {console.log(error)});
    

});
router.get('/postsfromfollowing', protectedSource, (req, res) => {
    PostModel.find({ author: { $in: req.dbUser.following } })
        .populate("author", "_id fullName")
        .populate("comments.commentedBy", "_id fullName")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts });
        })
        .catch((error) => {
            console.log(error);
        });
});
router.put('/like',protectedSource,(req,res)=>{
    PostModel.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.dbUser._id}
    },{
        new:true
    })
    .populate("author","_id fullName")
    .exec((error,result)=>{
            if(error){
                return   res.status(400).json({error:error});
            }
        else{
           res.json(result);
        }
    })
})
router.put('/unlike',protectedSource,(req,res)=>{
    PostModel.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.dbUser._id}
    },{
        new:true
    })
    .populate("author","_id fullName")
    .exec((error,result)=>{
            if(error){
                return   res.status(400).json({error:error});
            }
        else{
           res.json(result);
        }
    })
})
router.put('/comment',protectedSource,(req,res)=>{
    const comment={
        commentText:req.body.commentText,
        commentedBy:req.dbUser._id
    };
    PostModel.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("author","_id fullName")
    .populate("comments.commentedBy","_id fullName")
    .exec((error,result)=>{
            if(error){
                return   res.status(400).json({error:error});
            }
        else{
           res.json(result);
        }
    })
})
router.delete("/deletePost/:postId",protectedSource,(req,res)=>{
    PostModel.findOne({_id:req.params.postId})
    .populate("author","_id")
    .exec((error,post)=>{
        if(error || !post){
          return res.status(400).json({error:error})}
        if(post.author._id.toString() === req.dbUser._id.toString()){
            post.remove()
            .then((data)=>{
                res.json({result:data})
            })
            .catch((e)=>{console.log(e)})
        }  
    })
})
module.exports=router;