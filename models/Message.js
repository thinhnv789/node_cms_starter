const mongoose = require('mongoose');

/**
 * Message  Mongo DB model
 * @name messageModel
 */
const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: mongoose.Schema.Types.ObjectId},
    messageContent: { type: String },
    status: { type: Number }, // active, deleted
    isGroup: { type: Boolean },
    isRead: { type: Boolean,  default: false },
}, {timestamps: true, usePushEach: true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;