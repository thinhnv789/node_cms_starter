const NewsCategoryModel = require('./../models/NewsCategory');
const NewsModel = require('./../models/News');

const moment = require('moment');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    try {
        NewsModel.find({}).populate('category').exec((err, news) => {
            NewsCategoryModel.find({}).select({_id: 1, categoryName: 1}).exec((err, categories) => {
                res.render('news/index', {
                    title: 'Tin tức',
                    current: 'news',
                    data: news,
                    categories: categories
                });
            })
        })
    } catch (e) {
       return res.redirect('404');
    }
};

exports.getSearch = (req, res, next) => {
    try {
        let params = req.query;
        let findCondition = {};

        /** Query search */
        if (params.title) {
            findCondition.title = new RegExp('.*' + params.title + '.*', "i");
        }
        if (params.category) {
            findCondition.category = params.category;
        }
        if (params.statusDisplay) {
            findCondition.status = params.statusDisplay;
        }

        NewsModel.find(findCondition).exec((err, news) => {
            return res.json({
                success: true,
                errorCode: 0,
                data: news
            })
        })
    } catch (e) {
        return res.json({
            success: true,
            errorCode: 0,
            data: []
        })
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getCreate = async (req, res, next) => {
    try {
        let categories = await NewsCategoryModel.find({});
        res.render('news/create', {
            title: 'Viết bài',
            current: 'news',
            data: {
                categories: categories
            }
        });
    } catch (e) {
       
    }
}

exports.postCreate = (req, res, next) => {
    try {
        req.checkBody('title', 'Vui lòng nhập tiêu đề bài viết').notEmpty();
        req.checkBody('category', 'Chọn danh mục cho bài viết').notEmpty();
        req.checkBody('content', 'Nội dung bài viết không được để trống').notEmpty();
        req.checkBody('images', 'Đăng ảnh cho bài viết').notEmpty().len(2);
        
        req.getValidationResult().then(async function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.mapped();

                if (req.body.images) {
                    let imageSrc = [], images = JSON.parse(req.body.images);
                    for (let i=0; i<images.length; i++) {
                        imageSrc.push(process.env.MEDIA_URL + '/images/news/thumb/' + images[i]);
                    }

                    req.body.imageSrc = JSON.stringify(imageSrc);
                }
                let categories = await NewsCategoryModel.find({});

                res.render('news/create', {
                    title: 'Viết bài',
                    errors: errors,
                    data: {...req.body, ...{categories: categories}}
                });
            } else {
                try {
                    let postData = {
                        title: req.body.title || null,
                        slug: req.body.slug || null,
                        category: req.body.category || null,
                        brief: req.body.brief || null,
                        images: req.body.images || null,
                        content: req.body.content || null,
                        publishAt: req.body.publishAt ? moment(req.body.publishAt, 'DDMMYYYY').format() : null,
                        tags: req.body.tags || null,
                        status: req.body.status || 0,
                        createdBy: req.session.user._id
                    }
                    let newRecord = new NewsModel(postData);
                    newRecord.save((err, result) => {
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Vui lòng thử lại');
                            return res.redirect('/news');
                        }
                        NewsCategoryModel.findById(result.category).exec((err, category) => {
                            if (category) {
                                category.news.push(result._id);
                                category.save();
                            }
                        });
                        req.flash('success', 'Bài viết ' + result.title + ' đã được tạo');
                        res.redirect('/news');
                    });
                } catch (e) {

                }
            }
        });
    } catch (e) {
       
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getEdit = (req, res, next) => {
    try {
        NewsModel.findById(req.params.newsId).exec((err, news) => {
            NewsCategoryModel.find({}).exec((err, categories) => {
                res.render('news/edit', {
                    title: 'Chỉnh sửa bài viết',
                    current: 'news',
                    data: Object.assign(news, {categories: categories})
                });
            });
        });
    } catch (e) {
       
    }
}

exports.postUpdate = (req, res, next) => {
    try {
        req.checkBody('title', 'Vui lòng nhập tiêu đề bài viết').notEmpty();
        req.checkBody('category', 'Chọn danh mục cho bài viết').notEmpty();
        req.checkBody('content', 'Nội dung bài viết không được để trống').notEmpty();
        req.checkBody('images', 'Đăng ảnh cho bài viết').notEmpty().len(2);
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.array();
                
                req.flash('errors', errors[0].msg);
                return res.redirect('/news/edit/' + req.params.newsId);
            } else {
                try {
                    NewsModel.findById(req.params.newsId).exec((err, news) => {
                        if (err || !news) {
                            req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                            res.redirect('/news/edit/' + req.params.newsId);
                        } else {
                            let oldCategoryId = news.category;
                            let newData = {
                                title: req.body.title || news.title,
                                slug: req.body.slug || news.slug,
                                category: req.body.category || news.category,
                                brief: req.body.brief || news.brief,
                                images: req.body.images || news.images,
                                content: req.body.content || news.content,
                                publishAt: req.body.publishAt ? moment(req.body.publishAt, 'DDMMYYYY').format() : moment(news.publishAt, 'DDMMYYYY').format(),
                                tags: req.body.tags || news.tags,
                                status: req.body.status || news.status,
                                updatedBy: req.session.user._id
                            }

                            news = Object.assign(news, newData);
                            news.save((err) => {
                                NewsCategoryModel.findById(news.category).exec((err, category) => {
                                    if (category) {
                                        category.news.pull(news._id);
                                        category.news.push(news._id);
                                        category.save();
                                    }
                                });
                                if (news.category !== oldCategoryId) {
                                    NewsCategoryModel.findById(oldCategoryId).exec((err, oldCategory) => {
                                        if (oldCategory) {
                                            oldCategory.news.pull(news._id);
                                            oldCategory.save();
                                        }
                                    })
                                }
                                req.flash('success', 'Cập nhật thành công');
                                res.redirect('/news');
                            });
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        });
    } catch (e) {
       console.log(e);
    }
}

exports.getDelete = (req, res, next) => {
    try {
        NewsModel.findById(req.params.newsId).exec((err, newsDelete) => {
            if (err || !newsDelete) {
                req.flash('errors', 'Không tìm thấy dữ liệu');
                return res.redirect('/news');
            }
            newsDelete.remove((err) => {
                if (err) {
                    req.flash('errors', 'Không tìm thấy dữ liệu');
                    return res.redirect('/news');
                }
                req.flash('success', 'Xóa bài viết thành công');
                return res.redirect('/news');
            })
        })
    } catch (e) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/news');
    }
}