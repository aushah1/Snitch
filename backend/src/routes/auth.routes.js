import { Router } from "express";
import {
  register,
  login,
  googleCallback,
  getMeController,
} from "../controllers/auth.controllers.js";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validators/auth.validator.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.post("/register", validateRegisterUser, register);
authRouter.post("/login", validateLoginUser, login);
authRouter.get("/getme", authenticateUser, getMeController);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback,
);

export default authRouter;
