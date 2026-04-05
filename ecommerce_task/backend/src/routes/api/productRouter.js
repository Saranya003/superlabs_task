const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");

// Public APIs (no auth middleware)
router.get("/products", ProductController.searchProducts);
router.get("/products/:searchWord", ProductController.getProductDetail);

module.exports = router;
