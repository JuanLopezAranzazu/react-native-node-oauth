const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: GitHubStrategy } = require("passport-github2");
const User = require("../models/User");

const upsert = (provider) => async (_at, _rt, profile, done) => {
  try {
    const user = await User.findOneAndUpdate(
      { provider, providerId: profile.id },
      {
        name: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    done(null, user);
  } catch (e) {
    done(e);
  }
};

const base = process.env.BASE_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${base}/auth/google/callback`,
    },
    upsert("google"),
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${base}/auth/github/callback`,
      scope: ["user:email"],
    },
    upsert("github"),
  ),
);

module.exports = passport;
