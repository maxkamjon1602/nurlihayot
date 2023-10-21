const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    description: { type: String },
    list: [{ type: Schema.Types.ObjectId, ref: "List" }],
});

PostSchema.virtual("url").get(function() {
    return `/catalog/post/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);