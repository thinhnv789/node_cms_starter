const jwt = require('jsonwebtoken');

const User = require('./../models/User');
/**
 * 
 * @param {*} data : {accountId}
 */
exports.jwtCreateToken = (data) => {
    let token = jwt.sign(data, process.env.SECRET);

    return token;
}

exports.jwtVerifyToken = (token, cb) => {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, data) {  
        if (err) {
          return cb(null);   
        } else {
            // if everything is good, save to request for use in other routes
            User.findOne({
                _id: data.userId,
                status: 1
            }).exec((err, user) => {
                if (err) {
                    return cb(null);   
                } else {
                    return cb(user); 
                }
            });
        }
    });
}