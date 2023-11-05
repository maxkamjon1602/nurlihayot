const List = require("../models/list");
const User = require("../models/user");
const Post = require("../models/post");
const Media = require("../models/media");
const asyncHandler = require("express-async-handler");

// Display list of all lists.
exports.list_list = asyncHandler(async (req, res, next) => {
  const lists = await List.find().sort({ name: 1 }).populate("user").exec();
  res.render("list_list", {
    title: "Lists",
    lists: lists,
  });
});

// Display detail page for a specific list.
exports.list_detail = asyncHandler(async (req, res, next) => {
  const [list, postsInList] = await Promise.all([
    List.findById(req.params.id).populate("user").exec(),
    Post.find({ list: req.params.id }).exec(),
  ]);

  if (list === null) {
    // No results.
    const err = new Error("List not found");
    err.status = 404;
    return next(err);
  }

  const mediaInPost = [];
  for (i=0; i<(Object.keys(postsInList).length); i++) {
    var tempMedia = await Media.find({ post: postsInList[i].id }).exec();
    var tempPost = [];
    tempPost.push(tempMedia);
    tempPost.push(postsInList[i]);
    mediaInPost.push(tempPost);
  }

  res.render("list_detail", {
    title: "Saved Posts",
    list: list,
    listPosts: postsInList,
    postMedia: mediaInPost,
  });
});

// Display list create form on GET.
exports.list_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: list create GET");
});

// Handle list create on POST.
exports.list_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: list create POST");
});

// Display list delete form on GET.
exports.list_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: list delete GET");
});

// Handle list delete on POST.
exports.list_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: list delete POST");
});

// Display list update form on GET.
exports.list_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: list update GET");
});

// Handle list update on POST.
exports.list_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: list update POST");
});
