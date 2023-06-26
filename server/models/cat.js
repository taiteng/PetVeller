const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    userEmail: String,
    imgURL: String,
    imgWidth: Number,
    imgHeight: Number,
    imgReferenceID: String,
    name: String,
    description: String,
    lifeSpan: String,
    origin: String,
    temperament: String,
    wikipediaURL: String,
});

const catModel = mongoose.model('userfavourites', catSchema);
module.exports = catModel;