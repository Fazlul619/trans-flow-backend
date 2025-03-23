const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user || !req.user.token) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    
    res.redirect(
      `http://localhost:5173/oauth-success?token=${req.user.token}&user=${encodeURIComponent(
        JSON.stringify(req.user.user)
      )}`
    );
  }
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication failed" });
    }


    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

module.exports = router;
