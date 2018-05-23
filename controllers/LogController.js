const Log = require('./../models/Log');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = async (req, res, next) => {
    try {
        let page = parseInt(process.env.DEFAULT_PAGE, 10),
            queryPage = parseInt(req.query.page, 10),
            pageSize = parseInt(process.env.DEFAULT_PAGESIZE, 10),
            queryPageSize = parseInt(req.query.pageSize),
            findCondition = {};

        if (queryPage && queryPage > 0) {
            page = queryPage;
        }
        if (queryPageSize && queryPageSize > 0) {
            pageSize = queryPageSize;
        }

        let data = await Log.find(findCondition).sort('-createdAt').skip((page - 1) * pageSize).limit(pageSize);
        let total = await Log.count(findCondition);

        res.render('log/index', {
            title: 'Log lịch sử',
            current: 'log',
            data: data,
            pageSize: pageSize,
            total: total
        });
    } catch (e) {
       next(e);
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
