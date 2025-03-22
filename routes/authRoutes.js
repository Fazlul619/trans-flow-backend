const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post("/signup", async (req, res) => {
    try {
      const { fullName, email, password, confirmPassword, role } = req.body;
  
     
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }
  
      
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ error: "User already exists" });
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
      
      const userRole = role || "user";
  
      
      const user = new User({ fullName, email, password: hashedPassword, role: userRole });
  
      
      await user.save();
  
      
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      
      res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
      
      res.status(500).json({ error: err.message });
    }
  });


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
