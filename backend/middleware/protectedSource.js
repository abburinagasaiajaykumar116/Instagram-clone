const jwt=require('jsonwebtoken');
const {SECRET_TOKEN}=require('../config');
const mongoose=require('mongoose');
const UserModel=mongoose.model('UserModel');
module.exports=(req,res,next)=>{
  const {authorization} = req.headers;
  //authorization-> Bearer abgsjjbaebjdbjd
  if(!authorization){
    return   res.status(400).json({error:"user not logged in"});
  }
  const token = authorization.toString().replace("Bearer ","");
  jwt.verify(token,SECRET_TOKEN,(error,payload)=>{
   if(error){
      return res.status(400).json({error:"user  not logged in"});
   }
   const {_id} = payload;
   UserModel.findById(_id)
   .then(dbUser=>{
     req.dbUser=dbUser;
     next();
   });


  });

}