import { NextFunction, Request, Response } from "express";
import Post from "../models/post.models";
import mongoose from "mongoose";

// import Comment from "../models/Comment";

export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name avatar"); // Populate the author field with username
    if (!posts) {
      res.status(404).json({ message: "No posts found" });
      return;
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object

    const { title, summary, content, imageurl } = req.body;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newPost = new Post({
      title,
      summary,
      content,
      imageurl,
      author: userId, // Use the user ID from the request object
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the next middleware (error handler)
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid post ID format." });
      return;
    }
    const post = await Post.findById(postId).populate("author", "name"); // Populate the author field with username
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const postId = req.params.id;
  const userId = req.user._id; // Assuming you have the user ID in the request object from auth middleware
  const { title, summary, content } = req.body;
  try {
    console.log(`postId:${postId}, userId:${userId}`);
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    console.log(post);
    if (post?.author.toString() !== userId.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, summary, content },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const updatePostImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.params.id; // Post ID from URL
    const { imageurl } = req.body; // Firebase image URL from request body
    const userId = req.user._id; // User ID from auth middleware

    // Validation
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!imageurl) {
      res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
      return;
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
      return;
    }

    // Check if user owns the post
    if (post.author.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        message: "You can only update your own posts",
      });
      return;
    }

    // Update the post with the image URL
    post.imageurl = imageurl;
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
      message: "Post image updated successfully",
    });
  } catch (error) {
    console.error("Error updating post image:", error);
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.id;

    const userId = req.user._id; // Assuming you have the user ID in the request object

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post.author.toString() !== userId.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
      return;
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, something went wrong" });
    return;
  }
};

export const getAllPostsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in the request object
    const posts = await Post.find({ author: userId });

    if (!posts) {
      res.status(404).json({ message: "No posts found for this user" });
      return;
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
