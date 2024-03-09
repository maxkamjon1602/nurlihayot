const User = require("../models/user");
const Credential = require("../models/credential");
const Post = require("../models/post");
const Media = require("../models/media");
const Avatar = require("../models/avatar");
const List = require("../models/list");
const Address = require("../models/address");
const Authentication = require("../models/authentication");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const { errorMonitor } = require("multer-gridfs-storage");
const { body, validationResult, param } = require("express-validator");

// Display list of all users.
exports.user_list = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find().sort({ lastName: 1 }).sort({ email: 1}).exec();

  const users = [];
  for (i=0; i<(Object.keys(allUsers).length); i++) {
    var tempAvatar = await Avatar.findOne({ user: allUsers[i].id }).exec();
    var arr = [];
    arr.push(tempAvatar);
    arr.push(allUsers[i]);
    users.push(arr);
  }

  res.render("user_list", {
    title: "User List",
    userList: allUsers,
    users: users,
  })
});

// Display detail page for a specific user.
exports.user_detail = asyncHandler(async (req, res, next) => {
  const [user, userAddress, userList, userPost, userAvatar] = await Promise.all([
    User.findById(req.params.id).exec(),
    Address.find({ user: req.params.id }).exec(),
    List.find({ user: req.params.id }).exec(),
    Post.find({ user: req.params.id }).exec(),
    Avatar.findOne({ user: req.params.id }).exec(),
  ]);

  if (user === null) {
    // No results.
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  function stringify(value) {
    return value ? value : '';
  }

  const postMedia = [];
  for (i=0; i<(Object.keys(userPost).length); i++) {
    var tempMedia = await Media.find({ post: userPost[i].id }).exec();
    var arr = [];
    arr.push(tempMedia);
    arr.push(userPost[i]);
    postMedia.push(arr);
  }

  res.render("user_detail", {
    title: "User",
    user: user,
    postMedia: postMedia,
    avatar: userAvatar,
    userAddress: userAddress,
    userList: userList,
  });
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
  // Get details of user and all their posts, lists, and addresses (in parallel)
  const [user, allPosts, allLists, allAddresses] = await Promise.all([
    User.findById(req.params.id).exec(),
    Post.find({ user: req.params.id }, "title created").exec(),
    List.find({ user: req.params.id }, "name").exec(),
    Address.find({ user: req.params.id }, "lineOne lineTwo city postcode").exec(),
  ]);

  if (user === null) {
    // No results.
    res.redirect("/");
  }

  res.render("user_delete", {
    title: "Delete User",
    user: user,
    userPosts: allPosts,
    userLists: allLists,
    del: false,
  });
});

// Handle user delete on POST.
exports.user_delete_post = [
  // Convert the element to an array,
  (req, res, next) => {
    if (!(req.body.element instanceof Array)) {
      if (typeof req.body.element === 'undefined') req.body.element = [];
      else req.body.element = new Array(req.body.element);
    }
    next();
  },
  body("element.*").escape(),
  body("confirm").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Get details of user and all their posts, lists and addresses (in parallel)
    const [user, credential, authentication, allPosts, allLists, allAddresses] = await Promise.all([
      User.findById(req.params.id).exec(),
      Credential.findOne({ user: req.params.id }).exec(),
      Authentication.findOne({ user: req.params.id }).exec(),
      Post.find({ user: req.params.id }).exec(),
      List.find({ user: req.params.id }).exec(),
      Address.find({ user: req.params.id }).exec(),
    ]);

    allPosts.lname = "Posts";
    allLists.lname = "Lists";

    for (const val of [allPosts, allLists]) {
      if (req.body.element.includes(val.lname)) {
        val.checked = 'true';
      }
    }

    console.log(req.body.element);
    console.log("*** --- *** --- ***");
    if (req.body.confirm) console.log(req.body.confirm);

    if (allPosts.length > 0 && !req.body.confirm || !errors.isEmpty()) {
      // User has posts. Render in same way as for GET route.
      res.render("user_delete", {
        title: "Delete User",
        user: user,
        userPosts: allPosts,
        userLists: allLists,
        errors: errors.array(),
        del: true,
      });
      return;
    } else {
      // User has no posts. Delete object and redirect to the home page.
      await Promise.all([
        Authentication.findByIdAndDelete(authentication.id),
        Credential.findByIdAndDelete(credential.id),
        User.findByIdAndDelete(user.id),
      ]);
      console.log("User deleted.");
      res.redirect("/");
    }
  }),
];

// Display user update form on GET.
exports.user_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user update GET");
});

// Handle user update on POST.
exports.user_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user update POST");
});

exports.user_settings = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.render("user_settings", {
    user: user,
  })
});