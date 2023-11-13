const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    logContent: String,
    inputDate: String,
});


const logModel = mongoose.model('logging', logSchema);
module.exports = logModel;