const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CredentialSchema = new Schema({
  username: { type: String, unique: true, required: true, minLength: 4, maxLength: 50 },
  password: { type: String, required: true, minLength: 8 },
  role: { type: String, default: "Basic", required: true },
  created: { type: Date, required: true },
  updated: { type: Date },
  lastLogin: { type: Date },
  numFailAttempts: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

// Virtuals for formatted Date parameters
CredentialSchema.virtual("created_formatted").get(function() {
  return DateTime.fromJSDate(this.created).toLocaleString(DateTime.DATETIME_SHORT);
});

CredentialSchema.virtual("updated_formatted").get(function() {
  return DateTime.fromJSDate(this.updated).toLocaleString(DateTime.DATE_SHORT);
});

// Virtual for user credentials URL
CredentialSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/credential/${this._id}`;
});

// Export model
module.exports = mongoose.model("Credential", CredentialSchema);