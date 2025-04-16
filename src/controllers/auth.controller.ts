import mongoose from "mongoose";
import User from "../models/user.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        status: 400,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject(); // Exclude password from user data before sending response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
      });
    }
    //If user exists, check password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email or password",
      });
    }
    //Generate JWT token

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {}
};

export const signOut = async (req, res, next) => {};
