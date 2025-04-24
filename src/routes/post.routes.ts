import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllPostsByUser,
} from "../controllers/post.controller";

const postRouter = Router();

//Get all posts
postRouter.get("/", getAllPosts);

//Create post
postRouter.post("/", createPost);

//Get post by ID
postRouter.get("/:id", getPost);

//Update post by ID
postRouter.put("/:id", updatePost);

//Delete post by ID
postRouter.delete("/:id", deletePost);

//Get all posts by a specific user
postRouter.get("/user/:userId", getAllPostsByUser);

export default postRouter;
// This code defines an Express router for handling post-related routes in a web application.
