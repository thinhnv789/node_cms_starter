const mongoose = require('mongoose');

/**
 * News  Mongo DB model
 * @name newsModel
 */
const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String },
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'NewsCategory'},
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

newsSchema.set('toJSON', {
    virtuals: true
});

/**
 * Function get images full url
 */
newsSchema.virtual('imageUrls').get(function () {
    let images = JSON.parse(this.images), imageUrls = [];

    for (let i=0; i<images.length; i++) {
        imageUrls.push(process.env.MEDIA_URL + '/images/news/thumb/' + images[i]);
    }

    return imageUrls;
});

/**
 * Function get images full url
 */
newsSchema.virtual('imageUrl').get(function () {
    let images = JSON.parse(this.images);

    return (process.env.MEDIA_URL + '/images/news/thumb/' + images[0]);
});

/**
 * Function get status
 */
newsSchema.virtual('statusDisplay').get(function () {
    return (this.status ? 'Public' : 'Draft');
});

/**
 * Remove news from news category
 */
newsSchema.pre('remove', function (next) {
    var news = this;
    news.model('NewsCategory').update(
        {_id: news.category},
        { $pull: { news: news._id } }, 
        next
    );
});

const News = mongoose.model('News', newsSchema);

module.exports = News;