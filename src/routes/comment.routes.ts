import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllCommentsOfPost,
  updateComment,
} from "../controllers/comment.controller";
import authorize from "../middlewares/auth.middleware";

const commentRouter = Router();

// Get all comments of a post
commentRouter.get("/post/:postId", getAllCommentsOfPost);

//Add comment to a post
commentRouter.post("/createComment", authorize, createComment);

//Update comment
commentRouter.put("/:id", authorize, updateComment);

//Delete comment
commentRouter.delete("/:id", authorize, deleteComment);

export default commentRouter;
// This code defines an Express router for handling comment-related routes in a web application.
