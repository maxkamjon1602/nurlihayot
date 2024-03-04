const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AvatarSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String },
    fileType: { type: String },
    file: { data: Buffer, contentType: String },
    size: { type: Number },
    src: { type: String },
    created: { type: Date, required: true },
    updated: { type: Date },
});

AvatarSchema.virtual("url").get(function() {
    return `/avatar/${this._id}`;
});

module.exports = mongoose.model("Avatar", AvatarSchema);