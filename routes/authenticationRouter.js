const express = require("express");
const router = express.Router();

// Require controller modules.
const authentication_controller = require("../controllers/authenticationController");


/// AUTHENTICATION ROUTES ///

// GET request for creating authentication. NOTE This must come before route for id (i.e. display authentication).
router.get("/", authentication_controller.authentication);

// GET request for creating authentication.
router.get("/login", authentication_controller.authentication_login_get);

// POST requst for authenticating user and credentials.
router.post("/login", authentication_controller.authentication_login_post);

// GET request for new users sign up.
router.get("/signup", authentication_controller.authentication_signup_get);

// POST request for creating authentication.
router.post("/signup", authentication_controller.authentication_signup_post);

// GET and POST request for verifying email.
router.get("/:id/verify", authentication_controller.authentication_verify_get);
router.post("/:id/verify", authentication_controller.authentication_verify_post);

// GET request to delete authentication.
router.get("/:id/delete", authentication_controller.authentication_delete_get);

// POST request to delete authentication.
router.post("/:id/delete", authentication_controller.authentication_delete_post);

// GET request to update authentication.
router.get("/:id/update", authentication_controller.authentication_update_get);

// POST request to update authentication.
router.post("/:id/update", authentication_controller.authentication_update_post);

// GET and POST request to reset password in credential
router.get("/reset", authentication_controller.authentication_password_reset_get);
router.post("/reset", authentication_controller.authentication_password_reset_post);

module.exports = router;