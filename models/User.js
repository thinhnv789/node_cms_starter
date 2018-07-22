const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Role = require('./Role');
const Permission = require('./Permission');

/**
 * User  Mongo DB model
 * @name userModel
 */
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true, index: true },
  firstName: {type: String},
  lastName: {type: String, index: true},
  gender: {type: Number}, // 1: male, 2: female, 3: other
  birthDay: {type: Date},
  avatar: {type: String},
  address: {type: String},
  email: { type: String },
  phoneNumber: { type: String },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  status: { type: Number, default: 0 }, // active, block, reported
  isOnline: { type: Boolean },
  groupChat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat' }],
  adminGroupChat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat' }],
  blockedGroupChat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat' }]
}, {timestamps: true, usePushEach: true});

userSchema.set('toJSON', {
  virtuals: true
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Function get fullName
 */
userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

/**
 * Function get avatar image url
 */
userSchema.virtual('avatarUrl').get(function () {
  return process.env.MEDIA_URL + '/images/avatar/thumb/' + this.avatar;
});

/**
 * Function get status
 */
userSchema.virtual('statusDisplay').get(function () {
  return (this.status ? 'Đã kích hoạt' : 'Chưa kích hoạt');
});
/* Custom function create */
userSchema.statics.cCreate = function(data, cb) {
  let newDoc = new User(data);
  newDoc.save((err, doc) => {
    if (doc.roles && doc.roles instanceof Array) {
      Role.find({_id: {$in: doc.roles}}).exec((err, rls) => {
        for (let i=0; i<rls.length; i++) {
          rls[i].users.pull(doc._id);
          rls[i].users.push(doc._id);
          rls[i].save();
        }
      });
    }

    if (doc.permissions && doc.permissions instanceof Array) {
      Permission.find({_id: {$in: doc.permissions}}).exec((err, prs) => {
        for (let i=0; i<prs.length; i++) {
          prs[i].users.pull(doc._id);
          prs[i].users.push(doc._id);
          prs[i].save();
        }
      });
    }

    cb(err, doc);
  });
};

/* Custom function update */
userSchema.statics.cUpdate = function(id, newData, cb) {
  User.findById(id).exec((err, u) => {
    let oldRoles = u.roles || [];
    let oldPers = u.permissions || [];

    u = Object.assign(u, newData);
    u.save((err, result) => {
      /* Remove old roles */
      for (let i=0; i<oldRoles.length; i++) {
        if (u.roles.indexOf(oldRoles[i]) >-1 ) {

        } else {
          Role.findById(oldRoles[i]).exec((err, r) => {
            if (r) {
              r.users.pull(u._id);
              r.save();
            }
          })
        }
      }
      /* Insert new roles */
      for (let j=0; j<u.roles.length; j++) {
        if (oldRoles.indexOf(u.roles[j]) >-1 ) {

        } else {
          Role.findById(u.roles[j]).exec((err, nr) => {
            if (nr) {
              nr.users.pull(u._id);
              nr.users.push(u._id);
              nr.save();
            }
          })
        }
      }

      /* Remove old permissions */
      for (let i=0; i<oldPers.length; i++) {
        if (u.permissions.indexOf(oldPers[i]) >-1 ) {

        } else {
          Permission.findById(oldPers[i]).exec((err, p) => {
            if (p) {
              p.users.pull(u._id);
              p.save();
            }
          })
        }
      }
      /* Insert new permissions */
      for (let j=0; j<u.permissions.length; j++) {
        if (oldPers.indexOf(u.permissions[j]) >-1 ) {

        } else {
          Permission.findById(u.permissions[j]).exec((err, np) => {
            if (np) {
              np.users.pull(u._id);
              np.users.push(u._id);
              np.save();
            }
          })
        }
      }

      cb(err, result);
    });
  })
};

/* Custom function delete */
userSchema.statics.cDelete = function(data, cb) {
  
};

const User = mongoose.model('User', userSchema);

module.exports = User;