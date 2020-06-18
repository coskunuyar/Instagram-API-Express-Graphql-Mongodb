const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    ownerId: String,
    img: String,
    likedByUsers: Array,
});

module.exports = mongoose.model('Post',PostSchema);