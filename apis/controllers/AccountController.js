const async = require('async');
const UserModel = require('./../../models/User');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getData = (req, res, next) => {
    try {
        let offset = parseInt(process.env.DEFAULT_OFFSET, 10),
            limit = parseInt(process.env.DEFAULT_LIMIT, 10),
            params = req.query;
            findCondition = {}, dataSort = {};

        /** Query search */
        if (params.search) {
            findCondition = {
                $or: [
                    {firstName: new RegExp('.*' + params.search + '.*', "i")},
                    {lastName: new RegExp('.*' + params.search + '.*', "i")},
                    {email: new RegExp('.*' + params.search + '.*', "i")}
                ]
            }
        }

        if (params.sort) {
            if (params.sort == 'fullName') {
                dataSort.lastName = (params.order == 'desc') ? -1 : 1;
            } else {
                dataSort[params.sort] = (params.order == 'desc') ? -1 : 1;
            }
        }
        console.log('dataSort', dataSort);
        async.parallel({
            accounts: function(cb) {
                UserModel.find(findCondition).select({password: 0, roles: 0, permissions: 0}).sort(dataSort).skip(offset).limit(limit).exec(cb)
            },
            total: function(cb) {
                UserModel.count().exec(cb)
            }
        }, function(err, results) {
            res.json({
                success: true,
                errorCode: 0,
                rows: results.accounts,
                total: results.total,
                message: req.i18n.__('GET_USERINFO_SUCCESSFULLY')
            })
        });
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            rows: [],
            total: 0,
            message: 'Server has exception'
        })
    }
}