import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  calculateCartTotal,
  increaseCartItemQuantity,
  decreaseCartItemQuantity
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.get("/", authenticateUser, getCart);
cartRouter.post("/add/:productId/:variantId", authenticateUser, addToCart);
cartRouter.post(
  "/remove/:productId/:variantId",
  authenticateUser,
  removeFromCart,
);
cartRouter.post(
  "/calculate",
  authenticateUser,
  calculateCartTotal,
);

cartRouter.get("/increase/:productId/:variantId", authenticateUser, increaseCartItemQuantity);
cartRouter.get("/decrease/:productId/:variantId", authenticateUser, decreaseCartItemQuantity);

export default cartRouter;
