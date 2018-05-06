const mongoose = require('mongoose');

/**
 * Log  Mongo DB model
 * @name logModel
 */
const logSchema = new mongoose.Schema({
    title: { type: String },
    ip: { type: String },
    referrer: { type: String },
    object: { type: mongoose.Schema.Types.ObjectId },
    collectionRef: { type: String },
    data: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true, usePushEach: true});

logSchema.index({host:1, collectionRef:1});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;