const mongoose = require('mongoose');

/**
 * Recent Message  Mongo DB model
 * @name recentMessageModel
 */
const recentMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId },
    recipient: { type: mongoose.Schema.Types.ObjectId },
    countUnread: { type: Number, default: 1 },
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    latestMessageContent: { type: String },
    isGroup: { type: Boolean, default: false },
    status: { type: Number, default: 1 }, // read, unread
}, {timestamps: true, usePushEach: true});

/* Create index */
recentMessageSchema.index({sender:1, recipient:1});

const RecentMessage = mongoose.model('RecentMessage', recentMessageSchema);

module.exports = RecentMessage;