const mongoose = require('mongoose');

/**
 * Session  Mongo DB model
 * @name sessionModel
 */
const sessionSchema = new mongoose.Schema({
  session: { type: String },
  expires: { type: Date }
}, {timestamps: true, usePushEach: true});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;