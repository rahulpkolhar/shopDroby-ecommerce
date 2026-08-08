const express=require("express");
const{protect}=require('../middleware/authmiddleware')
const{admin}=require('../middleware/adminmiddleware')
const {createorder,getorders,myorders,updateorderstatus}=require("../controller/ordercontroller");

const router=express.Router();

router.route('/').post(protect,createorder).get(protect,admin,getorders);
router.route('/myorders').get(protect,myorders);
router.route('/:id/status') .put(protect,admin,updateorderstatus);

module.exports=router;