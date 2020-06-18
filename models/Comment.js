const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    ownerId: String,
    postId: String,
    text: String
});

module.exports = mongoose.model('Comment',CommentSchema);