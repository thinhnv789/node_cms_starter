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

permissonSchema.set('toJSON', {
    virtuals: true
});

/**
 * Function get status
 */
permissonSchema.virtual('statusDisplay').get(function () {
    return (this.status ? 'Active' : 'Inactive');
});

permissonSchema.statics.createNew = function(data, cb) {
    let newDoc = new Permission(data);
    newDoc.save(cb);
    // return this.find({ name: new RegExp(name, 'i') }, cb);
};

const Permission = mongoose.model('Permission', permissonSchema);

module.exports = Permission;