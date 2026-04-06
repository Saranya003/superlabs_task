const express = require("express");
const router = express.Router();
const AdminController = require("../../controllers/adminController");
const authMiddleware = require("../../middleware/authMiddleware");
console.log('sdddddddddddddddddd');
const upload = require('../../utils/multerConfig');

const uploadFields = upload.fields([
  { name: 'images', maxCount: 1 },
]);

router.post("/login", AdminController.login);
router.get("/products", authMiddleware, AdminController.viewProducts);
router.post("/products", authMiddleware,uploadFields, AdminController.createProduct);
router.put("/products/:id", authMiddleware,upload.array("images"), AdminController.updateProduct);
router.delete("/products/:id", authMiddleware, AdminController.deleteProduct);

module.exports = router;
