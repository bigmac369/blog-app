import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: 6,
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp", // default avatar image
    },
  },
  { timestamps: true } //creates createdAt and updatedAt fields automatically
);

const User = mongoose.model("User", userSchema);

export default User;
