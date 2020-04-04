const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    image_id: { type: Schema.Types.ObjectId },
    email: { type: String },
    name: { type: String },
    gravatar: { type: String },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = model('Comment', CommentSchema);
