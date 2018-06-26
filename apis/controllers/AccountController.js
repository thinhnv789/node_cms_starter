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
        let findCondition = {};
        async.parallel({
            accounts: function(cb) {
                UserModel.find({}).select({password: 0, roles: 0, permissions: 0}).exec(cb)
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