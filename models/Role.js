var mongoose = require('mongoose');

/**
 * Role  Mongo DB model
 * @name roleModel
 */
const roleSchema = new mongoose.Schema({
    roleName: {type: String},
    description: {type: String},
    permissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Permission'}],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: Boolean,
}, {timestamps: true, usePushEach: true});

roleSchema.set('toJSON', {
    virtuals: true
});

/**
 * Function get status
 */
roleSchema.virtual('statusDisplay').get(function () {
    return (this.status ? 'Active' : 'Inactive');
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;