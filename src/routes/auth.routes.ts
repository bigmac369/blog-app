import { Router } from "express";
import { signUp } from "../controllers/auth.controller";
import { signIn } from "../controllers/auth.controller";
import { signOut } from "../controllers/auth.controller";

const authRouter = Router();

//Register user
authRouter.post("/sign-up", signUp);

//Login user
authRouter.post("/log-in", signIn);

//Logout user
authRouter.post("/sign-out", signOut);

export default authRouter;
// This code defines an Express router for handling authentication-related routes in a web application.
