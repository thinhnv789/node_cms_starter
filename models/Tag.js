const mongoose = require('mongoose');

/**
 * Tag Mongo DB model
 * @name TagModel
 */
const tagSchema = new mongoose.Schema({
    tagName: { type: String, unique: true },
    slug: {type: String},
    news: [{type: mongoose.Schema.Types.ObjectId, ref: 'News'}],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: { type: Number }, // active, inActive
}, {timestamps: true, usePushEach: true});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;