import mongoose from "mongoose";

const { Schema } = mongoose;

const likeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Like user is required"],
    },
    targetType: {
      type: String,
      enum: ["Post", "Comment"],
      required: [true, "Like target type is required"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      required: [true, "Like target ID is required"],
    },
  },
  { timestamps: true }
); //creates createdAt and updatedAt fields automatically

const Like = mongoose.model("Like", likeSchema);
export default Like;
