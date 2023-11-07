const Credential = require("../models/credential");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all credentials.
exports.credential_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential List Page");
});

// Display detail page for a specific credential.
exports.credential_detail = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential Detail Page");
});

// Display credential create form on GET.
exports.credential_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential create GET");
});

// Handle credential create on POST.
exports.credential_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential create POST");
});

// Display credential delete form on GET.
exports.credential_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential delete GET");
});

// Handle credential delete on POST.
exports.credential_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential delete POST");
});

// Display credential update form on GET.
exports.credential_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential update GET");
});

// Handle credential update on POST.
exports.credential_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: credential update POST");
});
