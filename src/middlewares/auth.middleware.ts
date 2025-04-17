import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config/env";
import jwt from "jsonwebtoken";
import User from "../models/user.models";

const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; // Type assertion to specify the type of decoded token

    const user = await User.findById(decoded.userId).select("-password"); // Exclude password field from the response

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    req.user = user; // Attach user to request object for further use in the route handlers

    next(); // Call the next middleware or route handler
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default authorize;
