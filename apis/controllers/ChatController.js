const UserModel = require('./../../models/User');
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

        UserModel.find(findCondition).exec((err, users) => {
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

        UserModel.find(findCondition).exec((err, users) => {
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