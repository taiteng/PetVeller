const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
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

const catModel = mongoose.model('catdetails', catSchema);
module.exports = catModel;