const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const { seller } = require("../middleware/sellermiddleware");
const { getAdminstats } = require("../controller/analysticcontroller");

 
router.get("/", protect, seller, getAdminstats);

module.exports = router;