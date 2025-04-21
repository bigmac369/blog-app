import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller";
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
userRouter.put("/:id", updateUser);

//Delete user by ID
userRouter.delete("/:id", deleteUser);

export default userRouter;
// This code defines an Express router for handling user-related routes in a web application.
