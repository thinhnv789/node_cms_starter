const mongoose = require('mongoose');

/**
 * News  Mongo DB model
 * @name newsModel
 */
const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String },
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'NewsCategory'}],
    brief: { type: String },
    content: { type: String },
    images: { type: String },
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    /* Seo  */
    seo: {
        htmlMetaTitle: { type: String },
        htmlMetaDescription: { type: String },
        htmlMetaKeywords: { type: String }
    },
    /* End Seo */
    publishAt: { type: Date },
    status: { type: Number }, // active, inActive
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true, usePushEach: true});

const News = mongoose.model('News', newsSchema);

module.exports = News;