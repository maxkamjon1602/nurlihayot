const express = require("express");
const router = express.Router();

// Require controller modules.
const post_controller = require("../controllers/postController");
const media_controller = require("../controllers/mediaController");
const user_controller = require("../controllers/userController");
const credential_controller = require("../controllers/credentialController");
const list_controller = require("../controllers/listController");
const address_controller = require("../controllers/addressController");



/// POST ROUTES ///

// GET catalog home page.
router.get("/", post_controller.index);

// GET request for creating a new post. Note, this must come before routes that display post (uses id).
router.get("/post/create", post_controller.post_create_get);

// POST request for creating posts.
router.post("/post/create", post_controller.post_create_post);

// GET request to delete post.
router.get("/post/:id/delete", post_controller.post_delete_get);

// POST request to delete post.
router.post("/post/:id/delete", post_controller.post_delete_post);

// GET request to update post.
router.get("/post/:id/update", post_controller.post_update_get);

// POST request to update post.
router.post("/post/:id/update", post_controller.post_update_post);

// GET request for one post.
router.get("/post/:id", post_controller.post_detail);

// GET request for list of all posts.
router.get("/posts", post_controller.post_list);



/// USER ROUTES ///

// GET request for creating user. NOTE This must come before route for id (i.e. display user).
router.get("/user/create", user_controller.user_create_get);

// POST request for creating user.
router.post("/user/create", user_controller.user_create_post);

// GET request to delete user.
router.get("/user/:id/settings/delete", user_controller.user_delete_get);

// POST request to delete user.
router.post("/user/:id/settings/delete", user_controller.user_delete_post);

// GET request to update user.
router.get("/user/:id/settings/update", user_controller.user_update_get);

// POST request to update user.
router.post("/user/:id/settings/update", user_controller.user_update_post);

router.get("/user/:id/settings", user_controller.user_settings);

// GET request for one user.
router.get("/user/:id", user_controller.user_detail);

// GET request for list of all users.
router.get("/users", user_controller.user_list);



/// CREDENTIAL ROUTES ///

// GET request for creating credential. NOTE This must come before route for id (i.e. display credential).
router.get("/credential/create", credential_controller.credential_create_get);

// POST request for creating credential.
router.post("/credential/create", credential_controller.credential_create_post);

// GET request to delete credential.
router.get("/credential/:id/delete", credential_controller.credential_delete_get);

// POST request to delete credential.
router.post("/credential/:id/delete", credential_controller.credential_delete_post);

// GET request to update credential.
router.get("/credential/:id/update", credential_controller.credential_update_get);

// POST request to update credential.
router.post("/credential/:id/update", credential_controller.credential_update_post);

// GET request for one credential.
router.get("/credential/:id", credential_controller.credential_detail);

// GET request for list of all credentials.
router.get("/credentials", credential_controller.credential_list);

router.get("/credential/:id/role", credential_controller.credential_role_get)
router.post("/credential/:id/role", credential_controller.credential_role_post)




/// MEDIA ROUTES ///

// GET request for creating media. NOTE This must come before route for id (i.e. display media).
router.get("/media/create", media_controller.media_create_get);

// POST request for creating media.
router.post("/media/create", media_controller.media_create_post);

// GET request to delete media.
router.get("/media/:id/delete", media_controller.media_delete_get);

// POST request to delete media.
router.post("/media/:id/delete", media_controller.media_delete_post);

// GET request to update media.
router.get("/media/:id/update", media_controller.media_update_get);

// POST request to update media.
router.post("/media/:id/update", media_controller.media_update_post);

// GET request for one media.
router.get("/media/:id", media_controller.media_detail);

// GET request for list of all medias.
router.get("/medias", media_controller.media_list);



/// LIST ROUTES ///

// GET request for creating list. NOTE This must come before route for id (i.e. display list).
router.get("/list/create/:id", list_controller.list_create_get);

// POST request for creating list.
router.post("/list/create/:id", list_controller.list_create_post);

// GET request to delete list.
router.get("/list/:id/delete", list_controller.list_delete_get);

// POST request to delete list.
router.post("/list/:id/delete", list_controller.list_delete_post);

// GET request to update list.
router.get("/list/:id/update", list_controller.list_update_get);

// POST request to update list.
router.post("/list/:id/update", list_controller.list_update_post);

// GET request for one list.
router.get("/list/:id", list_controller.list_detail);

// GET request for list of all lists.
router.get("/lists", list_controller.list_list);



/// ADDRESS ROUTES ///

// GET request for creating address. NOTE This must come before route for id (i.e. display address).
router.get("/address/create", address_controller.address_create_get);

// POST request for creating address.
router.post("/address/create", address_controller.address_create_post);

// GET request to delete address.
router.get("/address/:id/delete", address_controller.address_delete_get);

// POST request to delete address.
router.post("/address/:id/delete", address_controller.address_delete_post);

// GET request to update address.
router.get("/address/:id/update", address_controller.address_update_get);

// POST request to update address.
router.post("/address/:id/update", address_controller.address_update_post);

// GET request for one address.
router.get("/address/:id", address_controller.address_detail);

// GET request for list of all addresss.
router.get("/addresses/:id", address_controller.address_list);

module.exports = router;