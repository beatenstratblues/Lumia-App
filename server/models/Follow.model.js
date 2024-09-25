const mongoose = require("mongoose");

const FollowSchema = mongoose.Schema(
  {
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
  },
  {
    timestamps: true,
  }
);

const FollowModel = mongoose.model("follower", FollowSchema);

module.exports = { FollowModel };
