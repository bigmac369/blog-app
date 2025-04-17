import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/user.controller";
import authorize from "../middlewares/auth.middleware"; // Import the authorize middleware

const userRouter = Router();

//Get all users
userRouter.get("/", getAllUsers);

//Get user by ID
userRouter.get("/:id", authorize, getUser);

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
