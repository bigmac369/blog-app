import User from "../models/user.models";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password field from the response
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object
    const { name, email, password, newPassword, confirmPassword } = req.body;

    //Get user from the database
    const user = await User.findById(userId).select("-password"); // Exclude password field from the response

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    //Handle email and password updates
    if (name) user.name = name;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: "Email already exists",
        });
        return;
      }
      user.email = email;
    }

    // Handle password update only if currentPassword and newPassword are provided
    if (password || newPassword || confirmPassword) {
      if (!password || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: "All password fields are required",
        });
        return;
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        user.password
      );
      if (!isPasswordMatch) {
        res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: "New password and confirm password do not match",
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId; // Assuming you have the user ID in the request object

    //Delete user from the database
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
