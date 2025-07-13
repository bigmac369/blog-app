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
    console.log("User ID:", userId);
    const {
      username,
      email,
      password,
      newPassword,
      confirmPassword,
      profileImage,
    } = req.body;
    console.log("Request Body:", req.body);
    //Get user from the database
    // .select("-password");
    const user = await User.findById(userId); // Exclude password field from the response
    console.log(user);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    //Handle username and email updates
    if (username) user.name = username;

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

    if (profileImage) {
      user.avatar = profileImage;
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
      // Check if current password is correct
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
        return;
      }
      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: "New password and confirm password do not match",
        });
        return;
      }
      // Check if new password is the same as current password
      if (password === newPassword) {
        res.status(400).json({
          success: false,
          message: "New password must be different from current password",
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
