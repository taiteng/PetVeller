const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const userModel = mongoose.model('userdetails', userSchema);
module.exports = userModel;