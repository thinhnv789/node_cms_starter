const Log = require('./../models/Log');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    try {
        Log.find({}).sort('-createdAt').exec((err, data) => {
            res.render('log/index', {
                title: 'Log lịch sử',
                current: 'log',
                data: data
            });
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
        // if (params.firstName) {
        //     findCondition.firstName = new RegExp('.*' + params.firstName + '.*', "i");
        // }
        // if (params.lastName) {
        //     findCondition.lastName = new RegExp('.*' + params.lastName + '.*', "i");
        // }
        if (params.fullName) {
            findCondition = {
                $or: [
                    {firstName: new RegExp('.*' + params.fullName + '.*', "i")},
                    {lastName: new RegExp('.*' + params.fullName + '.*', "i")}
                ]
            }
        }
        if (params.userName) {
            findCondition.userName = new RegExp('.*' + params.userName + '.*', "i");
        }
        if (params.email) {
            findCondition.email = new RegExp('.*' + params.email + '.*', "i");
        }
        if (params.statusDisplay) {
            findCondition.status = params.statusDisplay;
        }

        LoginManager.find(findCondition).exec((err, data) => {
            return res.json({
                success: true,
                errorCode: 0,
                data: data
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
