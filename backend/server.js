const express= require('express');
const app=express();
const PORT=4000;
const mongoose=require('mongoose');
const { MONGODB_URI }=require('./config');

mongoose.connect(MONGODB_URI);
mongoose.connection.on('connected',()=>{
  console.log("connected");
});
mongoose.connection.on('error',(error)=>{
  console.log("some error",error);
});
require('./models/UserModel');
require('./models/PostModel');
app.use(express.json());
app.use(require('./routes/authentication.js'));
app.use(require('./routes/createpost.js'));
app.use(require('./routes/userRoute'));



app.listen(PORT,()=>{
    console.log("server started.");
});