const mongoose = require('mongoose');

/**
 * News Category  Mongo DB model
 * @name newsCategoryModel
 */
const newsCategorySchema = new mongoose.Schema({
    categoryName: { type: String, unique: true },
    slug: { type: String },
    description: {type: String},
    news: [{type: mongoose.Schema.Types.ObjectId, ref: 'News'}],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: { type: Number }, // active, inActive
}, {timestamps: true, usePushEach: true});

newsCategorySchema.set('toJSON', {
    virtuals: true
});

/**
 * Function get status
 */
newsCategorySchema.virtual('statusDisplay').get(function () {
    return (this.status ? 'Public' : 'Draft');
});

const NewsCategory = mongoose.model('NewsCategory', newsCategorySchema);

module.exports = NewsCategory;