const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

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
  role: {type: String},
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

const User = mongoose.model('User', userSchema);

module.exports = User;