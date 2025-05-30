import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllPostsByUser,
} from "../controllers/post.controller";
import authorize from "../middlewares/auth.middleware";

const postRouter = Router();

//Get all posts
postRouter.get("/", getAllPosts);

//Create post
postRouter.post("/", authorize, createPost);

//Get post by ID
postRouter.get("/:id", getPost);

//Update post by ID
postRouter.put("/:id", authorize, updatePost);

//Delete post by ID
postRouter.delete("/:id", authorize, deletePost);

//Get all posts by a specific user
postRouter.get("/user/:userId", authorize, getAllPostsByUser);

// //Get all comments of a post
// postRouter.get("/:postId/comments", getAllCommentsOfPost);

// //Create comment for a post
// postRouter.post("/:postId/comments", authorize, createComment);

export default postRouter;
// This code defines an Express router for handling post-related routes in a web application.
