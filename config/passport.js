const passport = require('passport');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  User.findOne({ email: profile._json.email }, (err, existingUser) => {
    if (err) { return done(err); }
    if (existingUser) {
      // return existingUser;
      done(err, existingUser);
    } else {
      const user = new User();
      user.email = profile._json.email;
      user.userName = profile._json.email;
      user.firstName = profile._json.first_name;
      user.lastName = profile._json.last_name;
      user.save((err) => {
        done(err, user);
      });
    }
  });
}));

/**
 * Sign in with Google.
 */
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_ID,
//   clientSecret: process.env.GOOGLE_SECRET,
//   callbackURL: '/auth/google/callback',
//   passReqToCallback: true
// }, (req, accessToken, refreshToken, profile, done) => {
//   if (req.user) {
//     User.findOne({ google: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, (err, user) => {
//           if (err) { return done(err); }
//           user.google = profile.id;
//           user.tokens.push({ kind: 'google', accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.gender = user.profile.gender || profile._json.gender;
//           user.profile.picture = user.profile.picture || profile._json.image.url;
//           user.save((err) => {
//             req.flash('info', { msg: 'Google account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ google: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
//         if (err) { return done(err); }
//         if (existingEmailUser) {
//           req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
//           done(err);
//         } else {
//           const user = new User();
//           user.email = profile.emails[0].value;
//           user.google = profile.id;
//           user.tokens.push({ kind: 'google', accessToken });
//           user.profile.name = profile.displayName;
//           user.profile.gender = profile._json.gender;
//           user.profile.picture = profile._json.image.url;
//           user.save((err) => {
//             done(err, user);
//           });
//         }
//       });
//     });
//   }
// }));
