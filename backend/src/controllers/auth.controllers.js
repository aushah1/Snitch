import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const validateToken = (user, res, message) => {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "8h",
  });
 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
};

export const register = async (req, res) => {
  try {
    const { email, contact, password, fullname, role } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or contact already in use" });
    }
    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role,
    });
    validateToken(user, res, "Registration successful");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    validateToken(user, res, "Login successful");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const googleCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  const email = emails[0].value;

  let user = await userModel.findOne({
    email,
  });

  if (!user) {
    user = await userModel.create({
      email,
      googleId: id,
      fullname: displayName,
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.redirect("http://localhost:5173/");
};
export const getMeController = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
};
