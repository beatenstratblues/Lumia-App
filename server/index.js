const express = require("express");
const { createServer } = require("node:http");
const { ConnectDatabase } = require("../server/services/DatabaseConnect");
const cors = require("cors");
const { userModel } = require("./models/User.Model");
const JWT = require("jsonwebtoken");
const { saltHashing } = require("./services/saltHashing");
const { upload } = require("./middlewares/multer.middleware");
const { uploadImageFunction } = require("./services/Cloudinary");
const { postModel } = require("./models/Post.Model");
const cookieParser = require("cookie-parser");
const { FollowModel } = require("./models/Follow.model");
const mongoose = require("mongoose");
const { commentModel } = require("./models/Comment.model");

require("dotenv").config();

const app = express();
const server = createServer(app);
ConnectDatabase();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.send("Hello!!!");
});

app.post("/handlefollow", async (req, res) => {
  const { Token } = req.cookies;
  const { followerID, followingID } = req.body;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const followDoc = await FollowModel.create({
      followerId: followerID,
      followingId: followingID,
    });
    return res.json("ok");
  });
});

app.post("/handleUnfollow", async (req, res) => {
  const { Token } = req.cookies;
  const { followerID, followingID } = req.body;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const followDoc = await FollowModel.deleteOne({
      followerId: followerID,
      followingId: followingID,
    });
    return res.json("ok");
  });
});

app.get("/followercount", async (req, res) => {
  const { Token } = req.cookies;
  const { id } = req.query;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const followerCount = await FollowModel.countDocuments({
      followingId: id,
    });
    return res.json({ followerCount });
  });
});

app.get("/followingcount", async (req, res) => {
  const { Token } = req.cookies;
  const { id } = req.query;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const followingCount = await FollowModel.countDocuments({
      followerId: id,
    });
    return res.json({ followingCount });
  });
});

app.get("/followcheck", async (req, res) => {
  const { Token } = req.cookies;
  const { id } = req.query;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const followCheck = await FollowModel.findOne({
      followerId: info.id,
      followingId: id,
    });

    if (followCheck) return res.json({ followCheck: true });
    else return res.json({ followCheck: false });
  });
});

app.get("/search", async (req, res) => {
  const { search } = req.query;

  const regExp = new RegExp(search, "i");

  const data = await userModel.find({ username: { $regex: regExp } });

  return res.json(data);
});

app.get("/userData", async (req, res) => {
  const { Token } = req.cookies;
  const { id } = req.query;

  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const data = await userModel.findOne({ _id: id });
    return res.json(data);
  });
});

app.get("/readpost/:id", async (req, res) => {
  const response = await postModel
    .findOne({ _id: req.params.id })
    .populate("authorId");
  return res.json(response);
});

app.post("/register", async (req, res) => {
  const { fullname, username, email, password } = req.body;

  await userModel.create({
    fullname,
    username,
    email,
    password: saltHashing(password),
    profilePicture: "",
    bio: "",
  });
  return res.json("ok");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await userModel.findOne({
    username,
  });

  const UserPassword = userDoc.password;
  if (saltHashing(password) === UserPassword) {
    await JWT.sign(
      {
        fullname: userDoc.fullname,
        username: userDoc.username,
        id: userDoc._id,
      },
      process.env.JWT_SECRET_KEY,
      {},
      (err, token) => {
        if (err) throw err;
        return res.cookie("Token", token).json(userDoc);
      }
    );
  }
});

app.post("/post", upload.single("file"), async (req, res) => {
  const cloudinaryResponse = await uploadImageFunction(req.file.path);
  const { caption, content } = req.body;

  const { Token } = req.cookies;

  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    await postModel.create({
      caption,
      content,
      imageUrl: cloudinaryResponse.url,
      authorId: info.id,
    });
  });

  return res.json("ok");
});

app.get("/userprofileposts/:id", async (req, res) => {
  let postData = [];
  const { id } = req.params;
  const { Token } = req.cookies;

  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const Data = await postModel.find({ authorId: id }).populate("authorId");
    postData = Data;
    return res.json(postData);
  });
});

app.get("/userposts/:id", async (req, res) => {
  let postData = [];
  const { id } = req.params;
  const { Token } = req.cookies;

  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;

    const followings = await FollowModel.find({ followerId: id }).select(
      "followingId"
    );
    const followingIds = followings.map((follow) => follow.followingId);

    followingIds.push(id);

    const posts = await postModel
      .find({ authorId: { $in: followingIds } }) //basically fetching all the posts where the author id is in the provided array
      .populate("authorId") //method is used to execute the query and return a promise that resolves to the result (the list of posts).
      .sort({ CreatedAt: -1 })
      .exec();

    return res.json(posts);
  });
});

app.post("/updatepassword", async (req, res) => {
  const { Token } = req.cookies;
  const { Oldpassword, Newpassword } = req.body;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const DATA = info;
    const { password } = await userModel.findOne({ username: DATA.username });

    if (password === saltHashing(Oldpassword)) {
      await userModel.findOneAndUpdate(
        { username: DATA.username },
        { $set: { password: saltHashing(Newpassword) } }
      );
    } else {
      return res.json("error");
    }
    return res.json("ok");
  });
});

app.post("/updatepfp", upload.single("pfp"), async (req, res) => {
  const cloudinaryResponse = await uploadImageFunction(req.file.path);
  const { Token } = req.cookies;
  const bodyData = req.body;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const userData = info;

    try {
      await userModel.findOneAndUpdate(
        { username: userData.username },
        { $set: { profilePicture: cloudinaryResponse.url } }
      );
    } catch (error) {
      return res.json("error");
    }

    return res.json("ok");
  });
});

app.post("/updateprofilebanner", upload.single("pb"), async (req, res) => {
  const cloudinaryResponse = await uploadImageFunction(req.file.path);
  const { Token } = req.cookies;
  const bodyData = req.body;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const userData = info;

    try {
      await userModel.findOneAndUpdate(
        { username: userData.username },
        { $set: { profileBanner: cloudinaryResponse.url } }
      );
    } catch (error) {
      return res.json("error");
    }

    return res.json("ok");
  });
});

app.post("/updatebio", async (req, res) => {
  const { Token } = req.cookies;
  const bodyData = req.body;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const userData = info;

    try {
      await userModel.findOneAndUpdate(
        { username: userData.username },
        { $set: { bio: bodyData.Bio } }
      );
    } catch (error) {
      return res.json("error");
    }

    return res.json("ok");
  });
});

app.post("/postcomment", async (req, res) => {
  const { Token } = req.cookies;
  const { content, postId } = req.body;
  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    try {
      await commentModel.create({ content, postId, authorId: info.id });
    } catch (error) {
      return res.json("error");
    }
    return res.json("ok");
  });
});


app.get("/fetchcomment", async (req, res) => {
  const { Token } = req.cookies;
  const { postId } = req.query;


  async function populateReplies(comments) {
    for (let comment of comments) {
      if (comment.replies.length > 0) {
        const populatedReplies = await commentModel
          .find({ _id: { $in: comment.replies } })
          .populate("authorId") 
          .exec();
  

        comment.replies = await populateReplies(populatedReplies);
      }
    }
    return comments;
  }
  try {
    const comments = await commentModel
      .find({ postId })
      .populate("authorId") 
      .sort({ createdAt: -1 })
      .exec();

    const populatedComments = await populateReplies(comments);

    return res.json(populatedComments);
  } catch (error) {
    console.error(error);
    return res.status(500).json("error");
  }
});

app.post("/postcommentreply", async (req, res) => {
  const { Token } = req.cookies;
  const { commentReply } = req.body;
  const { commentId } = req.query;

  JWT.verify(Token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });

    try {
      const rep = await commentModel.create({
        content: commentReply,
        authorId: info.id,
        replies: [],
      });

      await commentModel.findOneAndUpdate(
        { _id: commentId },
        { $push: { replies: rep._id } }
      );
      return res.json("ok");
    } catch (error) {
      console.log(error);
      return res.json("error");
    }
  });
});

server.listen(8000, () => {
  console.log("server running at http://0.0.0.0:8000");
});
