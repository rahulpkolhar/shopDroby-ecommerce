const express = require("express");
const multer = require("multer");

const { protect } = require("../middleware/authmiddleware");
const { seller } = require("../middleware/sellermiddleware");

const {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productcontroller");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, seller, upload.single("image"), createProduct);

router
  .route("/mine")
  .get(protect, seller, getMyProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, seller, upload.single("image"), updateProduct)
  .delete(protect, seller, deleteProduct);

module.exports = router;