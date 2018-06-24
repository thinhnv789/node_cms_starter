const UserModel = require('./../../models/User');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getInfo = (req, res, next) => {
    try {
        UserModel.findById(req.session.user._id).select({
            password: 0
        }).exec((err, user) => {
            if (err) {
                return res.json({
                    success: false,
                    errorCode: '001',
                    message: req.i18n.__('ER_QUERY_DB')
                })
            }
            res.json({
                success: true,
                errorCode: 0,
                data: user,
                message: req.i18n.__('GET_USERINFO_SUCCESSFULLY')
            })
        })
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            message: 'Server has exception'
        })
    }
}