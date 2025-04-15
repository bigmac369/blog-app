import express from "express";

import { PORT } from "./config/env.js";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import commentRouter from "./routes/comment.routes";
import connectToDatabase from "./database/mongodb";

const app = express();

app.use("api/v1/auth", authRouter);
app.use("api/v1/users", userRouter);
app.use("api/v1/posts", postRouter);
app.use("api/v1/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
