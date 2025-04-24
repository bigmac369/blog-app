import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  text: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Comment author is required"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Comment post is required"],
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
