const UserModel = require('./../../models/User');
const Message = require('./../../models/Message');
const RecentMessage = require('./../../models/RecentMessage');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getContacts = (req, res, next) => {
    try {
        let keyword = req.query.keyword;
        let findCondition = {
            _id: {$ne: req.session.user._id}
        };

        UserModel.find(findCondition).select({
            password: 0
        }).exec((err, users) => {
            if (err) {
                return res.json({
                    success: false,
                    errorCode: '110',
                    data: [],
                    message: 'Error query database'
                })
            }
            return res.json({
                success: true,
                errorCode: 0,
                data: users,
                message: 'Get list contacts successfully'
            })
        });
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            data: [],
            message: 'Server exception'
        })
    }

}

exports.getSearch = (req, res, next) => {
    try {
        let keyword = req.query.keyword;
        let findCondition = {
            _id: {$ne: req.session.user._id}
        };

        /** Query search */
        if (keyword) {
            findCondition = {
                _id: {$ne: req.session.user._id},
                $or: [
                    {firstName: new RegExp('.*' + keyword + '.*', "i")},
                    {lastName: new RegExp('.*' + keyword + '.*', "i")}
                ]
            }
        }

        UserModel.find(findCondition).select({
            password: 0
        }).exec((err, users) => {
            if (err) {
                return res.json({
                    success: false,
                    errorCode: '110',
                    data: [],
                    message: 'Error query database'
                })
            }
            return res.json({
                success: true,
                errorCode: 0,
                data: users,
                message: 'Get list contacts successfully'
            })
        });
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            data: [],
            message: 'Server exception'
        })
    }

}

/* Get messages */
exports.getMessages = (req, res, next) => {
    try {
        let page = parseInt(process.env.DEFAULT_PAGE, 10),
            queryPage = parseInt(req.query.page, 10),
            pageSize = parseInt(process.env.DEFAULT_PAGESIZE, 10),
            queryPageSize = parseInt(req.query.pageSize),
            partnerId = req.params.partnerId;

        if (queryPage && queryPage > 0) {
            page = queryPage;
        }
        if (queryPageSize && queryPageSize > 0) {
            pageSize = queryPageSize;
        }

        Message.find({
            $or: [
                { sender: req.session.user._id, recipient: partnerId },
                { sender: partnerId, recipient: req.session.user._id }
            ]
        }).populate({
            path: 'sender',
            model: 'User',
            select: {
                password: 0
            }
        }).sort({
            createdAt: -1
        }).skip((page - 1) * pageSize).limit(pageSize).exec((err, messages) => {
            if (err) {
                console.log('err', err);
                return res.json({
                    success: false,
                    errorCode: '001',
                    message: global.i18n.__('ER_QUERY_DB')
                })
            }
            res.json({
                success: true,
                errorCode: 0,
                data: messages,
                message: 'Get list messages successfully'
            })
        })
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            data: [],
            message: 'Server exception'
        })
    }
}

/* Get recent messages */
exports.getRecentMessages = (req, res, next) => {
    try {
        let page = parseInt(process.env.DEFAULT_PAGE, 10),
            queryPage = parseInt(req.query.page, 10),
            pageSize = parseInt(process.env.DEFAULT_PAGESIZE, 10),
            queryPageSize = parseInt(req.query.pageSize);

        if (queryPage && queryPage > 0) {
            page = queryPage;
        }
        if (queryPageSize && queryPageSize > 0) {
            pageSize = queryPageSize;
        }

        RecentMessage.find({
            recipient: req.session.user._id
        }).populate({
            path: 'sender',
            model: 'User',
            select: {
                password: 0
            }
        }).sort({
            createdAt: -1
        }).skip((page - 1) * pageSize).limit(pageSize).exec((err, recentMessages) => {
            if (err) {
                console.log('err', err);
                return res.json({
                    success: false,
                    errorCode: '001',
                    message: global.i18n.__('ER_QUERY_DB')
                })
            }
            res.json({
                success: true,
                errorCode: 0,
                data: recentMessages,
                message: 'Get list messages successfully'
            })
        })
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            data: [],
            message: 'Server exception'
        })
    }
}