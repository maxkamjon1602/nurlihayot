const Media = require("../models/media");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all medias.
exports.media_list = asyncHandler(async (req, res, next) => {
  const allMedias = await Media.find().populate("post").exec();

  // for (const media of allMedias) {
  //   res.contentType(media.fileType);
  //   res.end(media.file.buffer, "binary");  
  // }

  res.render("media_list", {
    title: "Media List",
    mediaList: allMedias,
  });
});

// Display detail page for a specific media.
exports.media_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: media detail: ${req.params.id}`);
});

// Display media create form on GET.
exports.media_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: media create GET");
});

// Handle media create on POST.
exports.media_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: media create POST");
});

// Display media delete form on GET.
exports.media_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: media delete GET");
});

// Handle media delete on POST.
exports.media_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: media delete POST");
});

// Display media update form on GET.
exports.media_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: media update GET");
});

// Handle media update on POST.
exports.media_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: media update POST");
});
