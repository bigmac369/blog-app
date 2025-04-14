import express from "express";

import { PORT } from "./config/env.ts";

import authRouter from "./routes/auth.routes.ts";
import userRouter from "./routes/user.routes.ts";
import postRouter from "./routes/post.routes.ts";
import commentRouter from "./routes/comment.routes.ts";

const app = express();

app.use("api/v1/auth", authRouter);
app.use("api/v1/users", userRouter);
app.use("api/v1/posts", postRouter);
app.use("api/v1/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
