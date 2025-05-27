import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config/env";
import jwt from "jsonwebtoken";
import User from "../models/user.models";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // let token;

    // if (
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith("Bearer")
    // ) {
    //   const token = req.headers.authorization.split(" ")[1];
      // console.log("Token from headers:", token);
      // }
      const token = req.cookies.access_token; // Get the token from cookies
      // console.log(req.cookies); // Log all cookies for debugging
      // console.log("Token from cookies:", token);

      if (!token) {
        res.status(401).json({
          success: false,
          message: "No token provided",
        });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; // Type assertion to specify the type of decoded token
      // console.log("Decoded token:", decoded);

      const user = await User.findById(decoded.userId).select("-password"); // Exclude password field from the response
      // console.log("User from DB:", user);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Unauthorizedddd",
        });
        return;
      }

      req.user = user; // Attach user to request object for further use in the route handlers

      next(); // Call the next middleware or route handler
  } catch (error) {
    
    res.status(401).json({
      success: false,
      message: "Unauthorizedddd",
      error,
    });
  }
};

export default authorize;
