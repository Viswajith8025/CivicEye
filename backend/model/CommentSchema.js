import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "complaint",
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  text: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("comment", commentSchema);
export default Comment;
