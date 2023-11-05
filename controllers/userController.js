const User = require("../models/user");
const Post = require("../models/post");
const Media = require("../models/media");
const List = require("../models/list");
const Address = require("../models/address");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const { errorMonitor } = require("multer-gridfs-storage");

// Display list of all users.
exports.user_list = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find().sort({ lastName: 1 }).exec();
  res.render("user_list", {
    title: "User List",
    userList: allUsers,
  })
});

// Display detail page for a specific user.
exports.user_detail = asyncHandler(async (req, res, next) => {
  const [user, userAddress, userList, userPost, userMedia] = await Promise.all([
    User.findById(req.params.id).exec(),
    Address.find({ user: req.params.id }).exec(),
    List.find({ user: req.params.id }).exec(),
    Post.find({ user: req.params.id }).exec(),
  ]);

  if (user === null) {
    // No results.
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  const postMedia = [];
  for (i=0; i<(Object.keys(userPost).length); i++) {
    var tempMedia = await Media.find({ post: userPost[i].id }).exec();
    var arr = [];
    arr.push(tempMedia);
    arr.push(userPost[i]);
    postMedia.push(arr);
  }
  console.log(postMedia);

  res.render("user_detail", {
    title: "User",
    user: user,
    postMedia: postMedia,
    userAddress: userAddress,
    userList: userList,
    
  })
});

// Display user create form on GET.
exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user create GET");
});

// Handle user create on POST.
exports.user_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user create POST");
});

// Display user delete form on GET.
exports.user_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user delete GET");
});

// Handle user delete on POST.
exports.user_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user delete POST");
});

// Display user update form on GET.
exports.user_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user update GET");
});

// Handle user update on POST.
exports.user_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user update POST");
});
