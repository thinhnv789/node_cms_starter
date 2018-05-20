const mongoose = require('mongoose');

/**
 * Permission  Mongo DB model
 * @name Model
 */
const permissonSchema = new mongoose.Schema({
    permissionName: {type: String},
    accessRouter: {type: String, unique: true},
    description: {type: String},
    status: {type: Number},
    roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true, usePushEach: true});

const Permission = mongoose.model('Permission', permissonSchema);

module.exports = Permission;