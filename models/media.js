const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MediaSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    fileName: { type: String },
    fileType: { type: String },
    file: { data: Buffer, contentType: String },
    size: { type: Number },
    src: { type: String },
    created: { type: Date, required: true },
    updated: { type: Date },
});

MediaSchema.virtual("url").get(function() {
    return `/media/${this._id}`;
});

MediaSchema.virtual("created_formatted").get(function() {
    return DateTime.fromJSDate(this.created).toLocaleString(DateTime.DATETIME_SHORT);
});

MediaSchema.virtual("updated_formatted").get(function() {
    return DateTime.fromJSDate(this.updated).toLocaleString(DateTime.DATE_SHORT);
});


module.exports = mongoose.model("Media", MediaSchema);