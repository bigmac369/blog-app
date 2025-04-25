import { Response, Request, NextFunction } from "express";

import Like from "../models/like.models";

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object
    const { targetType, targetId } = req.body; // Assuming you have the targetType and targetId in the request body

    const existingLike = await Like.findOne({
      user: userId,
      targetType,
      targetId,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      res.status(200).json({ message: "Like removed" });
      return;
    }

    //if no existing like, create a new one
    const newLike = new Like({
      user: userId,
      targetType,
      targetId,
    });

    await newLike.save();

    res.status(201).json({ liked: true, like: newLike });
    return;
  } catch (error) {
    next(error);
  }
};
