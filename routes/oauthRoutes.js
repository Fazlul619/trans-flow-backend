const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Redirect user to Google for authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user || !req.user.token) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Redirect frontend with JWT token
    res.redirect(`http://localhost:5173/oauth-success?token=${req.user.token}`);
  }
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

module.exports = router;
