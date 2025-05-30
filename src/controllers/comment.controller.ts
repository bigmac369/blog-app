import { NextFunction, Request, Response } from "express";
import Comment from "../models/comment.models";
import Post from "../models/post.models";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, postId } = req.body;
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const newComment = await Comment.create({
      text,
      author: userId, // Use the user ID from the request object
      post: post._id,
    });

    const populatedComment = await newComment.populate("author", "name email"); // or whatever fields you need
    // console.log("New Comment Created:", populatedComment);
    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object
    const commentId = req.params.id;
    //check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    //check if the user is the author of the comment
    if (comment.author.toString() !== userId.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this comment" });
      return;
    }
    //update the comment
    const { text } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    ).populate("author", "name email"); // or whatever fields you need
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object
    const commentId = req.params.id;
    console.log(req.params);
    //check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    //check if the user is the author of the comment
    if (comment.author.toString() !== userId.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
      return;
    }
    //delete the comment
    await Comment.findByIdAndDelete(commentId);
    res.status(204).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllCommentsOfPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    console.log(postId);
    //check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    //get all comments for the post
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "name"
    );
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
