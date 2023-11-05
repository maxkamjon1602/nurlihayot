const Address = require("../models/address");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all addresss.
exports.address_list = asyncHandler(async (req, res, next) => {
  const userid = await User.findById( req.params.id ).exec();
  const addresses = await Address.find({ user: userid.id }).sort({ city: 1 }).populate("user").exec();
  res.render("address_list", { title: "Address List", addressList: addresses });
});

// Display detail page for a specific address.
exports.address_detail = asyncHandler(async (req, res, next) => {
  const address = await Address.findById(req.params.id).populate("user").exec();

  if (address === null){
    // No posts.
    const err = new Error("Post not found");
    err.status = 404;
    return next(err);
  }

  res.render("address_detail", {
    title: address.user.name,
    address: address
  });
});

// Display address create form on GET.
exports.address_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: address create GET");
});

// Handle address create on POST.
exports.address_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: address create POST");
});

// Display address delete form on GET.
exports.address_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: address delete GET");
});

// Handle address delete on POST.
exports.address_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: address delete POST");
});

// Display address update form on GET.
exports.address_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: address update GET");
});

// Handle address update on POST.
exports.address_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: address update POST");
});
