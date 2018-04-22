const mongoose = require('mongoose');

/**
 * Login Manager  Mongo DB model
 * @name loginManagerModel
 */
const loginManagerModel = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  fullName: { type: String },
  sessionId: { type: String },
  platform: { type: String }, // Chrome, safari, ...
  os: { type: String } // window, linux, ...
}, {timestamps: true, usePushEach: true});

const LoginManager = mongoose.model('LoginManager', loginManagerModel);

module.exports = LoginManager;