const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    lineOne: { type: String },
    lineTwo: { type: String },
    city: { type: String },
    country: { type: String},
    postcode: { type: String, maxLength: 10 },
    created: { type: Date },
    updated: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

AddressSchema.virtual("created_formatted").get(function() {
    return DateTime.fromJSDate(this.created).toLocaleString(DateTime.DATETIME_SHORT);
});

AddressSchema.virtual("updated_formatted").get(function() {
    return DateTime.fromJSDate(this.updated).toLocaleString(DateTime.DATE_SHORT);
});

AddressSchema.virtual("url").get(function() {
    // We don't use array function as we will need the this object
    return `/catalog/address/${this._id}`;
});

module.exports = mongoose.model("Address", AddressSchema);