const mongoose = require('mongoose');

/**
 * Group Chat Mongo DB model
 * @name groupChatModel
 */
const groupChatSchema = new mongoose.Schema({
    groupName: { type: String, unique: true },
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    blackList: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    description: {type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: { type: Number }, // active, inActive
}, {timestamps: true, usePushEach: true});

groupChatSchema.set('toJSON', {
    virtuals: true
});

/**
 * Function get status
 */
groupChatSchema.virtual('statusDisplay').get(function () {
    return (this.status ? 'Active' : 'Inactive');
});

const GroupChat = mongoose.model('GroupChat', groupChatSchema);

module.exports = GroupChat;