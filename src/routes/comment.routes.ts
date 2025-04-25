import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllCommentsOfPost,
  updateComment,
} from "../controllers/comment.controller";
import authorize from "../middlewares/auth.middleware";

const commentRouter = Router();

// Get all comments
commentRouter.get("/:id/comments", getAllCommentsOfPost);

//Add comment to a post
commentRouter.post("/:id/comments", authorize, createComment);

//Update comment
commentRouter.put("/comments/:id", updateComment);

//Delete comment
commentRouter.delete("/comments/:id", deleteComment);

export default commentRouter;
// This code defines an Express router for handling comment-related routes in a web application.
