const mongoose = require('mongoose');
const connectDB=async()=>{
    try{
       const con= await mongoose.connect(process.env.MONGO_URI,)
            

   
        console.log('mongodb connected successfully');
    }
    catch (error){
        console.error('mongodb connection failed:',error.msg);
        process.exit(1);
    }
};
module.exports=connectDB;