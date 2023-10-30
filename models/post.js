const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    created: { type: Date, required: true },
    updated: { type: Date },
    list: [{ type: Schema.Types.ObjectId, ref: "List" }],
});

PostSchema.virtual("created_formatted").get(function() {
    return DateTime.fromJSDate(this.created).toLocaleString(DateTime.DATETIME_SHORT);
});

PostSchema.virtual("updated_formatted").get(function() {
    return DateTime.fromJSDate(this.updated).toLocaleString(DateTime.DATE_SHORT);
});

PostSchema.virtual("url").get(function() {
    return `/catalog/post/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);