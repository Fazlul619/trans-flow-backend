require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const passport = require("passport");
const transactionRoutes = require("./routes/transactionRoutes");
require("./config/passport");
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("API Running..."));

app.use("/api/contact", contactRoutes);

app.use('/api/auth', authRoutes); 
app.use("/api/transactions", transactionRoutes); 
const oauthRoutes = require("./routes/oauthRoutes");
app.use("/api/auth", oauthRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
