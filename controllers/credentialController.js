const User = require("../models/user");
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

// 
exports.credential_role_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: user update GET");
});

exports.credential_role_update_post = [
  body("role").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const credential = new Credential({
      role: "admin",
      _id: req.params.id,
    });

    if(!errors.isEmpty()){
      res.render("user_admin", {
        errors: errors.array(),
      });
      return;
    } else {
      if (role === "admin") {
        await Credential.findById(req.params.id)
          .then((user) => {
            if(user.role !== "admin") {
              user.role = role;
              user.save((err) => {
                //MongoDB error checker
                if(err) {
                  res
                    .status("400")
                    .json({ message: 'An error occured', error: err.message });
                  process.exit(1);
                }
                res.status("201").json({ message: 'Update successful', user });
              });
            } else {
              res.status(400).json({ message: "User is already an Admin" });
            }
          })
          .catch((error) => {
            res
              .status(400)
              .json({ message: 'An error occured', error: error.message });
          });
      }
    }
  })
];