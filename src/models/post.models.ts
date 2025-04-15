import { kMaxLength } from "buffer";
import mongoose from "mongoose";
import { ref, title } from "process";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post author is required"],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
); //creates createdAt and updatedAt fields automatically
