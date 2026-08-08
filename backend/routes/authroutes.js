const express=require("express");
const router = express.Router();
const{registeruser,loginuser,getusers}=require("../controller/authcontroller");
const{ protect }=require('../middleware/authmiddleware');
const{admin}=require('../middleware/adminmiddleware');

router.post("/register", registeruser);
router.post("/login", loginuser);
router.get("/users",protect,admin, getusers);

module.exports=router;