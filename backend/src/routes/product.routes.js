import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
  addProductVariant,
  searchProducts,
} from "../controllers/product.controllers.js";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProductValidator } from "../validators/product.validator.js";
import multer from "multer";
import { get } from "mongoose";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 7,
  },
});

const productRouter = express.Router();

productRouter.post(
  "/",
  upload.array("images", 7),
  authenticateSeller,
  createProductValidator,
  createProduct,
);

productRouter.get("/", getAllProducts);
productRouter.get("/seller", authenticateSeller, getSellerProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/:id", getProductDetails);

productRouter.post(
  "/:productId/variants",
  authenticateSeller,
  upload.array("images", 7),
  addProductVariant,
);

export default productRouter;
