import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import likeRouter from "./routes/like.routes";
import commentRouter from "./routes/comment.routes";
import connectToDatabase from "./database/mongodb";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // EXACT frontend origin
    credentials: true, // allow cookies, Authorization headers, etc.
  })
);

// Serve static files from uploads directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.get("/", (req, res) => {
//   res.cookie("sky", "blue", {
//     httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
//     secure: true, // Use secure cookies in production
//     sameSite: "none", // Helps prevent CSRF attacks
//     maxAge: 3600000, // 1 hour in milliseconds
//   });
//   res.cookie("grass", "green");

//   res.send("Hello World!");
// });

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
