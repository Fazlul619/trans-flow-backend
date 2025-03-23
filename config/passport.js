const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          
          const fullName = profile.displayName || profile.name?.givenName || "Google User";

          user = new User({
            fullName, 
            email: profile.emails[0].value,
            password: "OAuth", 
            role: "admin",
          });

          await user.save();
        }

        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return done(null, { user, token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract email (fallback if not available)
        const userEmail = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

        let user = await User.findOne({ email: userEmail });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: userEmail,
            password: "OAuth", // Set a placeholder password
            role: "admin",
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Passport Serialization (Only Needed for Session-Based Auth)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

