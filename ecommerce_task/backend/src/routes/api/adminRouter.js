const express = require("express");
const router = express.Router();
const AdminController = require("../../controllers/adminController");
const authMiddleware = require("../../middleware/authMiddleware");
console.log('sdddddddddddddddddd');

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/products"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/login", AdminController.login);
router.get("/products", authMiddleware, AdminController.viewProducts);
router.post("/products", authMiddleware,upload.array("images"), AdminController.createProduct);
router.put("/products/:id", authMiddleware,upload.array("images"), AdminController.updateProduct);
router.delete("/products/:id", authMiddleware, AdminController.deleteProduct);

module.exports = router;
