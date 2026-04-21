import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();


cartRouter.get("/", authenticateUser, getCart )
cartRouter.post("/add/:productId/:variantId", authenticateUser, addToCart);

export default cartRouter;
