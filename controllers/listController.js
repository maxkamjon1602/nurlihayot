const List = require("../models/list");
const asyncHandler = require("express-async-handler");

// Display list of all lists.
exports.list_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: list list");
});

// Display detail page for a specific list.
exports.list_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: list detail: ${req.params.id}`);
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