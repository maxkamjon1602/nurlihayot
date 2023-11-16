const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthenticationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  credential: { type: Schema.Types.ObjectId, ref: "Credential", required: true },
  created: { type: Date },
  updated: { type: Date },
  status: { type: Boolean }, // verified or not
  remember: { type: Boolean }, // remember me, or not
  online: { type: Boolean }, // is user online or not
});

AuthenticationSchema.virtual("created_formatted").get(function() {
    return DateTime.fromJSDate(this.created).toLocaleString(DateTime.DATETIME_SHORT);
});

AuthenticationSchema.virtual("updated_formatted").get(function() {
    return DateTime.fromJSDate(this.updated).toLocaleString(DateTime.DATE_SHORT);
});

AuthenticationSchema.virtual("url").get(function() {
  // We don't use array function as we will need the this object
  return `/catalog/authentication/${this._id}`;
});

module.exports = mongoose.model("Authentication", AuthenticationSchema);