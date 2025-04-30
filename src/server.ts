import express from "express";
import cors from "cors";

import { PORT } from "./config/env";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import likeRouter from "./routes/like.routes";
import commentRouter from "./routes/comment.routes";
import connectToDatabase from "./database/mongodb";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
