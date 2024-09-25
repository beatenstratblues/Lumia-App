const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("post", postSchema);

module.exports = {
  postModel,
};
