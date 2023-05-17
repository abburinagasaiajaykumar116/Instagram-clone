const express = require('express');
const router=express.Router();
const mongoose=require('mongoose');
const UserModel=mongoose.model('UserModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {SECRET_TOKEN}=require('../config');
const protectedSource = require('../middleware/protectedSource');
router.get('/',(req,res)=>{
       res.send("hey jay!");   
});
router.get('/secured',protectedSource,(req,res)=>{
       res.send("welcome to secured area!");   
});
router.post('/login',(req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
       return   res.status(400).json({error:"one or more mandatory field is missing"});
  }
  UserModel.findOne({email:email})
  .then((dbUser)=>{
       if(!dbUser){
              return   res.status(400).json({error:"invalid credentials"});
       }
       bcrypt.compare(password,dbUser.password)
       .then((didMatch)=>{
              if(didMatch){
                    const jwttoken=jwt.sign({_id:dbUser._id},SECRET_TOKEN);
                    const {_id,fullName,email,followers,following,profilePicUrl}=dbUser;
                    res.json({token:jwttoken,UserInfo:{_id,fullName,email,followers,following,profilePicUrl}});
                  
              }else{
              return  res.status(400).json({result:"invalid credentials"});
              }   
       });


  })
  .catch((error)=>{console.log("error");});


});
router.post('/register',(req,res)=>{
    console.log(req.body);
    const {fullName,email,password,profilePicUrl}=req.body;
    if(!fullName || !email || !password){
      return   res.status(400).json({error:"one or more mandatory field is missing"});
    }
    UserModel.findOne({email:email})
    .then((dbUser)=>{
       if(dbUser){
              return   res.status(500).json({error:"user with same email already exists!"});
       }
       bcrypt.hash(password,16)
       .then((hashedpassword)=>{
              const user=new UserModel({fullName,email,password:hashedpassword,profilePicUrl:profilePicUrl});
               user.save()
               .then((u)=>{
                      res.status(300).json({result:"user registred successfully"});
                  
               })
               .catch((error)=>{console.log("error");});
       
       
              });
     
      

    })
    .catch((error)=>{console.log("error");});
   
});


module.exports=router;
