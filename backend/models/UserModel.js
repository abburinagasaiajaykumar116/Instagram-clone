const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
      fullName:{
        type:'String',
        required:true
      },
      email:{
        type:'String',
        required:true
      },
      password:{
        type:'String',
        required:true
      },
      profilePicUrl:{
          type:'String',
          default:"https://res.cloudinary.com/di6vrum7u/image/upload/v1665135818/Image-Not-Available_vh1naz.png"
      },
      followers:[{type:ObjectId,ref:"UserModel"}],
      following:[{type:ObjectId,ref:"UserModel"}]
});
mongoose.model('UserModel',userSchema);