const mongoose = require('mongoose');

const catFactsSchema = new mongoose.Schema({
    fact:String
});

const catFactsModel = mongoose.model('catFacts', catFactsSchema);
module.exports = catFactsModel;