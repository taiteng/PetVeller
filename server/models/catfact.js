const mongoose = require('mongoose');

const catFactsSchema = new mongoose.Schema({
    fact:String
});

const catFactsModel = mongoose.model('catFacts', catSchema);
module.exports = catFactsModel;