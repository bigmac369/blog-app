import User from "../models/user.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { Request, Response, NextFunction } from "express";

export const signUp = async (
  req: Request,
  res: Response,
  
) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      res.status(400).json({
        status: 400,
        message: "User already exists",
      });
      return;
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

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(400).json({
        status: 400,
        message: "User not found",
      });
      return;
    }
    //If user exists, check password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      res.status(400).json({
        status: 400,
        message: "Invalid email or password",
      });
      return;
    }
    //Generate JWT token

    // if (!JWT_SECRET) {
    //   throw new Error("JWT_SECRET is not defined");
    // }
    ///////Been moved to env.ts, we want app to fail fast during app startup, not when a user trying to login
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: false, // Use secure cookies in production
        maxAge: 3600000, // 1 hour in milliseconds
        sameSite: "none", // Helps prevent CSRF attacks
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: existingUser,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // Use secure cookies in production
      sameSite: "none",
      maxAge: 0, // Set maxAge to 0 to delete the cookie immediately
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
