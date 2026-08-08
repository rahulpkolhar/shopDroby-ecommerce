const User=require("../model/user");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const sendEmail=require("../utils/sendEmail");

const generateToken=(id)=>{
return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30d"});
};

const registeruser=async(req,res)=>{
const{name,email,password}=req.body;
try{
const existingUser=await User.findOne({email});
if(existingUser){
return res.status(400).json({message:"User already exists"});
}
const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt);
const newUser=await User.create({name,email,password:hashedPassword});
const otp=Math.floor(100000+Math.random()*900000).toString();
const message=`Welcome to Ecom, ${name}! Your OTP for registration is: ${otp}`;
await sendEmail(email,"Welcome to Ecom - OTP",message);
res.status(201).json({
_id:newUser._id,
name:newUser.name,
email:newUser.email,
role:newUser.role,
token:generateToken(newUser._id)
});
}catch(error){
console.log(error);
res.status(500).json({message:error.message});
}
};

const loginuser=async(req,res)=>{
const{email,password}=req.body;
try{
const existingUser=await User.findOne({email});
if(existingUser&&(await bcrypt.compare(password,existingUser.password))){
res.json({
_id:existingUser._id,
name:existingUser.name,
email:existingUser.email,
role:existingUser.role,
token:generateToken(existingUser._id)
});
}else{
res.status(401).json({message:"Invalid email or password"});
}
}catch(error){
console.log(error);
res.status(500).json({message:error.message});
}
};

const getusers=async(req,res)=>{
try{
const users=await User.find({}).select("-password");
res.json(users);
}catch(error){
console.log(error);
res.status(500).json({message:error.message});
}
};

module.exports={registeruser,loginuser,getusers};