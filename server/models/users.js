const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role:String,
});

const userModel = mongoose.model('userdetails', userSchema);
module.exports = userModel;