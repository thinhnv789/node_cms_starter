const NewsCategoryModel = require('./../models/NewsCategory');
const NewsModel = require('./../models/News');
const GroupChatModel = require('./../models/GroupChat');
const UserModel = require('./../models/User');

const moment = require('moment');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    try {
        GroupChatModel.find({}).exec((err, groups) => {
            res.render('group-chat/index', {
                title: 'Nhóm chat',
                current: 'group-chat',
                data: groups
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
        res.render('group-chat/create', {
            title: 'Tạo nhóm mới',
            current: 'group-chat'
        });
    } catch (e) {
       
    }
}

exports.postCreate = (req, res, next) => {
    try {
        req.checkBody('groupName', 'Vui lòng đặt tên nhóm').notEmpty();
        
        req.getValidationResult().then(async function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.mapped();

                res.render('group-chat/create', {
                    title: 'Tạo nhóm',
                    errors: errors,
                    data: req.body
                });
            } else {
                try {
                    let postData = {
                        groupName: req.body.groupName || null,
                        description: req.body.description || null,
                        status: req.body.status || 0,
                        members: [req.session.user._id],
                        admins: [req.session.user._id],
                        createdBy: req.session.user._id
                    }
                    let newRecord = new GroupChatModel(postData);
                    newRecord.save((err, result) => {
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Vui lòng thử lại');
                            return res.redirect('/group-chat');
                        }

                        UserModel.findById(req.session.user._id).exec((err, user) => {
                            if (!user.groupChat)
                                user.groupChat = [];    
                            user.groupChat.push(result._id);
                            if (!user.adminGroupChat)
                                user.adminGroupChat = [];
                            user.adminGroupChat.push(result._id);
                            user.save();
                        });

                        req.flash('success', 'Nhóm chat ' + result.groupName + ' đã được tạo');
                        res.redirect('/group-chat');
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
exports.getEdit = async (req, res, next) => {
    try {
        let data = await GroupChatModel.findById(req.params.groupId);

        if (!data) {
            req.flash('errors', 'Không tìm thấy dữ liệu');
            return res.redirect('/group-chat');
        }
        console.log('data', data);
        res.render('group-chat/edit', {
            title: 'Chỉnh sửa nhóm',
            current: 'group-chat',
            data: data
        });
    } catch (e) {
       
    }
}

exports.postUpdate = async (req, res, next) => {
    try {
        req.checkBody('groupName', 'Vui lòng đặt tên nhóm').notEmpty();
        
        req.getValidationResult().then(async function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.array();
                
                req.flash('errors', errors[0].msg);
                return res.redirect('/group-chat/edit/' + req.params.groupId);
            } else {
                try {
                    let group = await GroupChatModel.findById(req.params.groupId);
                    if (!group) {
                        req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                        return res.redirect('/group-chat/edit/' + req.params.groupId);
                    }

                    let newData = {
                        groupName: req.body.groupName || group.groupName,
                        description: req.body.description || group.description,
                        status: req.body.status || group.status,
                        updatedBy: req.session.user._id
                    }

                    group = Object.assign(group, newData);
                    group.save((err) => {
                        req.flash('success', 'Cập nhật thành công');
                        res.redirect('/group-chat');
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

exports.getView = async (req, res, next) => {
    try {
        let group = await GroupChatModel.findById(req.params.groupId).populate('members').populate('admins');
        let users = await UserModel.find({
            status: 1,
            _id: {
                $nin: group.members
            }
        });

        if (!group) {
            req.flash('errors', 'Không tìm thấy dữ liệu');
            return res.redirect('/group-chat');
        }

        res.render('group-chat/view', {
            data: group,
            users: users
        });
    } catch (e) {

    }
}

exports.postAddMember = async (req, res, next) => {
    let groupId = req.params.groupId;
    let members = req.body.members;
    
    if (!members) {
        req.flash('errors', 'Chưa chọn thành viên nào');
        return res.redirect('/group-chat/view/' + groupId);
    }

    let group = await GroupChatModel.findById(groupId);
    if (!group) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/group-chat/view/' + groupId);
    }

    if (members instanceof Array) {

        for (let i=0; i<members.length; i++) {
            group.members.pull(members[i]);
            group.members.push(members[i]);
            await group.save();
        }
        UserModel.find({
            _id: {
                $in: members
            }
        }).exec((err, users) => {
            for (let j=0; j<users.length; j++) {
                if (!users[j].groupChat) {
                    users[j].groupChat = [];
                }
                users[j].groupChat.pull(groupId);
                users[j].groupChat.push(groupId);
                users[j].save();
            }
        });
        req.flash('success', 'Thêm thành viên thành công');
        res.redirect('/group-chat/view/' + groupId);
    } else {
        group.members.pull(members);
        group.members.push(members);
        group.save((err) => {
            UserModel.findById(members).exec((err, user) => {
                if (user) {
                    if (!user.groupChat) {
                        user.groupChat = [];
                    }
                    user.groupChat.pull(groupId);
                    user.groupChat.push(groupId);
                    user.save();
                }
            });
            req.flash('success', 'Thêm thành viên thành công');
            res.redirect('/group-chat/view/' + groupId);
        });
    }
}

exports.getAddAdmin = async (req, res, next) => {
    let groupId = req.params.groupId;
    let memberId = req.params.memberId;
    
    let group = await GroupChatModel.findById(groupId);
    if (!group || !memberId) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/group-chat/view/' + groupId);
    }

    group.admins.pull(memberId);
    group.admins.push(memberId);
    group.save((err) => {
        UserModel.findById(memberId).exec((err, user) => {
            if (user) {
                if (!user.adminGroupChat) {
                    user.adminGroupChat = [];
                }
                user.adminGroupChat.pull(groupId);
                user.adminGroupChat.push(groupId);
                user.save();
            }
        });
        req.flash('success', 'Đã thêm quản trị viên thành công');
        res.redirect('/group-chat/view/' + groupId);
    });
}

exports.getAddBlackList = async (req, res, next) => {
    let groupId = req.params.groupId;
    let memberId = req.params.memberId;
    
    let group = await GroupChatModel.findById(groupId);
    if (!group || !memberId) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/group-chat/view/' + groupId);
    }

    if (!group.blackList) {
        group.blackList = [];
    }
    group.blackList.pull(memberId);
    group.blackList.push(memberId);
    group.save((err) => {
        UserModel.findById(memberId).exec((err, user) => {
            if (user) {
                if (!user.blockedGroupChat) {
                    user.blockedGroupChat = [];
                }
                user.blockedGroupChat.pull(groupId);
                user.blockedGroupChat.push(groupId);
                user.save();
            }
        });
        req.flash('success', 'Đã chặn chat thành công');
        res.redirect('/group-chat/view/' + groupId);
    });
}

exports.getRemoveBlackList = async (req, res, next) => {
    let groupId = req.params.groupId;
    let memberId = req.params.memberId;
    
    let group = await GroupChatModel.findById(groupId);
    if (!group || !memberId) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/group-chat/view/' + groupId);
    }

    if (!group.blackList) {
        group.blackList = [];
    }
    group.blackList.pull(memberId);
    group.save((err) => {
        UserModel.findById(memberId).exec((err, user) => {
            if (user) {
                user.blockedGroupChat.pull(groupId);
                user.save();
            }
        });
        req.flash('success', 'Bỏ chặn thành công');
        res.redirect('/group-chat/view/' + groupId);
    });
}

exports.getRemoveAdmin = async (req, res, next) => {
    let groupId = req.params.groupId;
    let memberId = req.params.memberId;
    
    let group = await GroupChatModel.findById(groupId);
    if (!group || !memberId) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/group-chat/view/' + groupId);
    }

    group.admins.pull(memberId);
    group.save((err) => {
        UserModel.findById(memberId).exec((err, user) => {
            if (user) {
                if (!user.adminGroupChat) {
                    user.adminGroupChat = [];
                }
                user.adminGroupChat.pull(groupId);
                user.save();
            }
        });
        req.flash('success', 'Đã xóa quản trị viên thành công');
        res.redirect('/group-chat/view/' + groupId);
    });
}

exports.getDelete = async (req, res, next) => {
    try {
        let group = await GroupChatModel.findById(req.params.groupId);

        if (!group) {
            req.flash('errors', 'Có lỗi xảy ra');
            return res.redirect('/group-chat');
        }

        let members = group.members, groupId = group._id;

        /**
         * Remove foreign key
         */
        UserModel.find({
            _id: {
                $in: members
            }
        }).exec((err, users) => {
            for (let i = 0; i<users.length; i++) {
                try {
                    if (users[i].groupChat)
                        users[i].groupChat.pull(groupId);
                    if (users[i].adminGroupChat)
                        users[i].adminGroupChat.pull(groupId);
                    if (users[i].blockedGroupChat)
                        users[i].blockedGroupChat.pull(groupId);
                    users[i].save();
                } catch(e) {

                }
            }
        });

        group.remove((err) => {
            req.flash('success', 'Xóa nhóm thành công');
            res.redirect('/group-chat');
        })
    } catch (e) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/group-chat');
    }
}