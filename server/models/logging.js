const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
    {
        logContent: String,
    },
    { 
        timestamps: true,
    }
);

const logModel = mongoose.model('logging', logSchema);
module.exports = logModel;