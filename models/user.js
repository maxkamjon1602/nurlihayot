const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  lastName: { type: String, required: true, maxLength: 100 },
  created: { type: Date, required: true },
  updated: { type: Date },
  dob: { type: Date },
  bio: { type: String, maxLength: 350 },
  telephone: { type: String, maxLength: 15 },
  email: { type: String, required: true, maxLength: 100 },
  accounts: { type: Array },
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  // To avoid errors in cases where an user does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.firstName && this.lastName) {
    fullname = `${this.lastName}, ${this.firstName}`;
  }
  return fullname;
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);