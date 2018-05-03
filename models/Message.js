const mongoose = require('mongoose');

/**
 * Message  Mongo DB model
 * @name messageModel
 */
const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: mongoose.Schema.Types.ObjectId},
    messageContent: { type: String },
    messageType: { type: Number, default: 1 }, // 1: Text, 2: image, 3: video
    status: { type: Number, default: 1 }, // active, deleted
    isGroup: { type: Boolean, default: false },
    isRead: { type: Boolean,  default: false },
}, {timestamps: true, usePushEach: true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;