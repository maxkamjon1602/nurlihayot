const User = require("../models/user");
const Post = require("../models/post");
const Credential = require("../models/credential");
const Authentication = require("../models/authentication");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const { body, validationResult, ValidationChain, param } = require('express-validator');

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

// Display user role on GET
exports.credential_role_get = asyncHandler(async (req, res, next) => {
  const [user, credential] = await Promise.all([
    User.findById(req.params.id).exec(),
    Credential.findOne({ user: req.params.id }).exec(),
  ]);
  res.render("credential_role", {
    user: user,
    credential: credential.role,
  });
  console.log(credential.role);
});

// Display user role on POST
exports.credential_role_post = [
  body("role").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = await User.findById(req.params.id).exec();
    const credential = await Credential.findOne({ user: req.params.id }).exec();
    var changed = 'unchanged';
    var imgCount = true;

    if (req.body.role && req.params.id) {
      if (req.body.role === "Basic") {
        const posts = await Post.find({ user: req.params.id }).count().exec();
        if (posts >= 2) {
          credential.role = "admin";
          await credential.save();
          changed = 'changed';
          imgCount = false;
        } else {
          console.log('wait. your request is accepted');
        }
      } else if (req.body.role === "admin") {
        credential.role = "Basic";
        await credential.save();
        changed = 'changed';
        imgCount = false;
        console.log("You account was changed");
      } else {
        changed = 'unchanged';
        console.log("The process is interrupted");
        return;
      }
    }

    if(!errors.isEmpty()){
      res.render("credential_role", {
        user: user,
        credential: credential.role,
        updated: changed,
        imgCount,
      })
      return;
    } else {
      res.render("credential_role", {
        user: user,
        credential: credential.role,
        updated: changed,
        imgCount: imgCount,
      });
    }
  }),

];