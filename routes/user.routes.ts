import { Router } from "express";

const userRouter = Router();

//Get all users
userRouter.get("/", (req, res) => {
  // Logic for getting all users
  res.send("GETS all users");
});

//Get user by ID
userRouter.get("/:id", (req, res) => {
  const userId = req.params.id;
  // Logic for getting a user by ID
  res.send(`User details for ID: ${userId}`);
});

//Create user
userRouter.post("/", (req, res) => {
  // Logic for creating a user
  res.send("User created successfully!");
});

//Update user by ID
userRouter.put("/:id", (req, res) => {
  const userId = req.params.id;
  // Logic for updating a user by ID
  res.send(`User with ID: ${userId} updated successfully!`);
});

//Delete user by ID
userRouter.delete("/:id", (req, res) => {
  const userId = req.params.id;
  // Logic for deleting a user by ID
  res.send(`User with ID: ${userId} deleted successfully!`);
});

export default userRouter;
// This code defines an Express router for handling user-related routes in a web application.
