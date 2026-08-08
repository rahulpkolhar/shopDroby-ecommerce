const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const { admin } = require("../middleware/adminmiddleware");
const { getAdminstats } = require("../controller/analysticcontroller");

 
router.get("/", protect, admin, getAdminstats);

module.exports = router;