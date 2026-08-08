const express=require("express");
const {createorder,verifypayment}=require("../controller/paymentcontroller");

const router=express.Router();

router.post("/create-order",createorder);
router.post("/verify-payment",verifypayment);

module.exports=router;