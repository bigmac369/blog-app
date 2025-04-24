import { Request, Response } from "express";
import Post from "../models/post.models";

// import Comment from "../models/Comment";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId; // Assuming you have the user ID in the request object
    const { title, content } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newPost = new Post({ title, content, userId });
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPost = async (req: Request, response: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return response.status(404).json({ message: "Post not found" });
    }
    return response.status(200).json(post);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user.userId; // Assuming you have the user ID in the request object from auth middleware
  const { title, content } = req.body;
  try {
    const post = await Post.findById(postId);
    if (post?.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true }
    );

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId; // Assuming you have the user ID in the request object
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, something went wrong" });
  }
};
