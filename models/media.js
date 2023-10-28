const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MediaSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    fileName: { type: String },
    fileType: { type: String },
    file: { data: Buffer, contentType: String },
    size: { type: Number },
    src: { type: String },
    created: { type: Date, required: true },
    updated: { type: Date },
});

MediaSchema.virtual("url").get(function() {
    return `/catalog/media/${this._id}`;
});

module.exports = mongoose.model("Media", MediaSchema);