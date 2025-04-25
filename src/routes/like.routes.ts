import { Router } from "express";
import authorize from "../middlewares/auth.middleware";
import { toggleLike } from "../controllers/like.controller";

const likeRouter = Router();

likeRouter.post("/toggle", authorize, toggleLike);

export default likeRouter;
