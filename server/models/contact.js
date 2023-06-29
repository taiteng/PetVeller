const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: String,
    surname: String,
    email: String,
    phone: String,
    message: String
});

const contactModel = mongoose.model('contact', contactSchema);
module.exports = contactModel;