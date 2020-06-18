const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    friends: Array
});

module.exports = mongoose.model('User',UserSchema);