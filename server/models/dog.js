const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    id: Number,
    name: String,
    bred_for: String,
    life_span: String,
    temperament: String,
    origin: String,
    imageURL: String,
});


const dogModel = mongoose.model('dogFavourites', dogSchema);
module.exports = dogModel;