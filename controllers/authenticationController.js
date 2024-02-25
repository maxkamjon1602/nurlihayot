const User = require("../models/user");
const Credential = require("../models/credential");
const Authentication = require("../models/authentication");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const { body, validationResult, ValidationChain, param } = require('express-validator');

// Authenticate to login existing users with GET request
exports.authentication = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: authentication on web load");
});

exports.authentication_login_get = (req, res, next) => {
  res.render("login", { title: "Login"});
};

exports.authentication_login_post = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 4, max: 54})
    .escape()
    .withMessage("Username must be specified")
    .custom(async value => {
      const credential = await Credential.findOne({ username: value });
      if (credential === null) {
        throw new Error('Username not found');
      }

      const arrAuth = await Authentication.findOne({ credential: credential.id });
      if (!arrAuth) {
        throw new Error('Not verified email');
      }
      }),
  body("password")
    .trim()
    .isLength({ min: 8, max: 254 })
    .escape()
    .withMessage("Password must be specified")
    .custom(async (value, { req }) => {
      const user = await Credential.findOne({ username: req.body.username });
      if (user) {
        bcrypt.compare(value, user.password).then(function (result) {
          if (!result) {
            throw new Error('Password incorrect');
          }
        });
      } else {
        throw new Error('Password incorrect');
      }
      // if (user && value !== user.password){
      //   throw new Error('Password incorrect');
      // }
    }),
  body("remember").escape(),
  
  // Process requst after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    
    var mybool = false;
    if (req.body.remember) {
      mybool = true;
    }

    console.log("Checkpoint: 25/02/2024.");

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("login", {
        username: req.body.username,
        checked: mybool.toString(),
        errors: errors.array(),
      });
      return;
    } else {
      const arrCred = await Credential.findOne({ username: req.body.username});
      const arrAuth = await Authentication.findOne({ credential: arrCred.id });
      const authentication = new Authentication({
        user: arrCred.user,
        credential: arrCred.id,
        created: arrAuth.created,
        updated: new Date(),
        status: true,
        remember: mybool,
        online: true,
        _id: arrAuth.id,
      });


      const authUser = await Authentication.findByIdAndUpdate(arrAuth.id, authentication, {});
      // Redirect to home page.
      res.redirect('/')
    }
  })
];

// Display Authentication create form on GET.
exports.authentication_signup_get = asyncHandler(async (req, res, next) => {
  res.render("signup_form", { title: "Create new user" });
});

exports.authentication_signup_post = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 4, max: 33 })
    .escape()
    .withMessage("Username must be specified")
    .custom(async value => {
      const credential = await Credential.findOne({ username: value });
      if (credential) {
        throw new Error('Username already in user');
      }
    }),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Email must be specified.")
    .custom(async value => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in user');
      }
    }),
  body("password").trim().isLength({ min: 8, max: 30 }).escape().withMessage("Password must be specified"),
  body("passwordConfirmation").trim().isLength({ min: 8, max: 30}).escape().custom((value, { req }) => {
    return value === req.body.password;
  }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create object to pass user input.
    const user = new User({
      created: new Date(),
      updated: new Date(),
      email: req.body.email,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("signup_form", {
        title: "Create new user",
        params: user,
        username: req.body.username,
        errors: errors.array(),
      });
      return;
    } else {
      // Date from form is valid. Create user and credential.
      await user.save();
      const newUser = await User.findOne({ email: user.email }).exec();

      const credentialdetail = {
        username: req.body.username,
        password: req.body.password,
        role: "Basic",
        created: new Date(),
        updated: new Date(),
        user: newUser,
      }

      const saltRounds = 12;
      bcrypt.hash(credentialdetail.password, saltRounds).then(function(hash) {
        credentialdetail.password = hash;
        const credential = new Credential(credentialdetail);
        credential.save();
      });
      
      // Redirect to home page.
      res.redirect(`${newUser.id}/verify`);
    }
  })
];

exports.authentication_verify_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();

  if (user === null) {
    // No results
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("signup_email", {
    title: "User Verification",
    user: user,
  });
});

exports.authentication_verify_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: authentication verify POST");
});

exports.authentication_role_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Update to Admin");
});

// Display authentication delete form on GET.
exports.authentication_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: authentication delete GET");
});

// Handle authentication delete on POST.
exports.authentication_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: authentication delete POST");
});

// Display authentication update form on GET.
exports.authentication_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: authentication update GET");
});

// Handle authentication update on POST.
exports.authentication_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: authentication update POST");
});

exports.authentication_password_reset_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GET Authentication reset password from Credential table");
});

exports.authentication_password_reset_post = asyncHandler(async (req, res, next) => {
  
  // To check the user input is email address.
  // app.post(
  //   '/recover-password',
  //   // These are equivalent.
  //   body().isEmail(),
  //   body('').isEmail(),
  //   (req, res) => {
  //     // Handle request
  //   },
  // );

  // To verify that the password matches the repeat.
  // app.post(
  //   '/create-user',
  //   body('password').isLength({ min: 5 }),
  //   body('passwordConfirmation').custom((value, { req }) => {
  //     return value === req.body.password;
  //   }),
  //   (req, res) => {
  //     // Handle request
  //   },
  // );

  // In order to check that an e-mail is not in use
  // app.post(
  //   '/create-user',
  //   body('email').custom(async value => {
  //     const user = await UserCollection.findUserByEmail(value);
  //     if (user) {
  //       throw new Error('E-mail already in use');
  //     }
  //   }),
  //   (req, res) => {
  //     // Handle the request
  //   },
  // );

  res.send("NOT IMPLEMENTED: POST Authentication reset password from Credential table");
});