const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    postId: {
      type: String,
    },
    content: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("comment", commentSchema);

module.exports = {
  commentModel,
};
