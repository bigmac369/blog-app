import { Router } from "express";

const commentRouter = Router();

// Get all comments
commentRouter.get("/:id/comments", (req, res) => {
  // Logic for getting all comments
  res.send("GETS all comments");
});

//Add comment to a post
commentRouter.post("/:id/comments", (req, res) => {
  // Logic for adding a comment to a post
  res.send("Comment added successfully!");
});

//Update comment
commentRouter.put("/comments/:id", (req, res) => {
  const commentId = req.params.id;
  // Logic for updating a comment
  res.send(`Comment with ID: ${commentId} updated successfully!`);
});

//Delete comment
commentRouter.delete("/comments/:id", (req, res) => {
  const commentId = req.params.id;
  // Logic for deleting a comment
  res.send(`Comment with ID: ${commentId} deleted successfully!`);
});

export default commentRouter;
// This code defines an Express router for handling comment-related routes in a web application.
