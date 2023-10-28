const Post = require("../models/post");
const User = require("../models/user");
const List = require("../models/list");
const Media = require("../models/media");
const Address = require("../models/address");

// const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of posts, post files, users, user addresses and list counts (in parallel)
    const [
        numPosts,
        numMedias,
        numMediaVideos,
        numUsers,
        numLists,
        numAddresses,
    ] = await Promise.all([
        Post.countDocuments({}).exec(),
        Media.countDocuments({}).exec(),
        Media.countDocuments({ fileType: "MP4" }).exec(),
        User.countDocuments({}).exec(),
        List.countDocuments({}).exec(),
        Address.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Nurlihayot",
        postCount: numPosts,
        mediaCount: numMedias,
        mediaVideoCount: numMediaVideos,
        userCount: numUsers,
        listCount: numLists,
        addressCount: numAddresses,
    });
});

// Display list of all posts.
exports.post_list = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find({}, "user title created")
        .sort({ created: 1 })
        .populate("user")
        .exec();
    res.render("post_list", { title: "Post List", postList: allPosts });
});

// Display detail page for a specific post.
exports.post_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: post detail: ${req.params.id}`);
});

// Display post create form on GET.
exports.post_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: post create GET");
});

// Handle post create on POST.
exports.post_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: post create POST");
});

// Display post delete form on GET.
exports.post_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: post delete GET");
});

// Handle post delete on POST.
exports.post_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: post delete POST");
});

// Display post update form on GET.
exports.post_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: post update GET");
});

// Handle post update on POST.
exports.post_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: post update POST");
});
