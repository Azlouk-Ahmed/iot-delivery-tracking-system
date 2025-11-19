const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/user");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const photo = profile.photos?.[0]?.value?.replace("=s96-c", "=s400-c");

        const email = profile.emails[0].value.toLowerCase();

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authMethod = user.password ? "both" : "google";
          }
          user.name = profile.displayName;
          user.email = email;
          user.photo = photo;
          user.lastLogin = new Date();
          user.isEmailVerified = true;
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            email: email,
            name: profile.displayName,
            photo: photo,
            authMethod: "google",
            isEmailVerified: true,
          });
        }

        console.log("Google authentication successful:", user.email);
        done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-refreshTokens");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
