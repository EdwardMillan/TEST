import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profilePictureURL: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
