const nodemailer = require('nodemailer');

const UserModel = require('./../models/User');
const SessionModel = require('./../models/Session');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    // global.io.sockets.emit('hello', 'hello ttt');
    // console.log('global.io.sockets', global.io.sockets);
    try {
        res.render('dashboard/index', {
            title: 'Hệ thống quản trị - Dashboard',
            current: 'dashboard'
        });
    } catch (e) {
       
    }
};

exports.getCropper = (req, res, next) => {
    try {
        res.render('dashboard/cropper');
    } catch (e) {
       
    }
}

exports.getInitUser = (req, res, next) => {
    try {
        let newUser = new UserModel();
        newUser.firstName = 'Nguyen Viet';
        newUser.lastName = 'Thinh';
        newUser.userName = 'admin';
        newUser.email = 'admin@gmail.com';
        newUser.password = '123456';
        newUser.save((err) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json('successfully');
            }
        })
    } catch (e) {
       
    }
};

exports.getSendMail = (req, res, next) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dev.thinhnv@gmail.com',
            pass: 'dev@2018'
        }
    });
    const mailOptions = {
        from: 'dev.thinhnv@gmail.com', // sender address
        to: 'thinhnv.vnu@gmail.com, thinhnv@vega.com.vn', // list of receivers
        subject: 'Subject of your email', // Subject line
        html: '<p>Your html here</p>'// plain text body
	};
	transporter.sendMail(mailOptions, function (err, info) {
		if(err)
		  console.log(err)
		else
		  console.log(info);
	});
	res.json('ttt');
}