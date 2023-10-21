const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ListSchema = new Schema({
    name: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

ListSchema.virtual("url").get(function() {
    // We don't use array function as we will need the this object
    return `/catalog/list/${this._id}`;
});

module.exports = mongoose.model("List", ListSchema);