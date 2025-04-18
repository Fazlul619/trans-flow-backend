require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("API Running..."));


app.use('/api/auth', authRoutes); 
app.use("/api/transactions", transactionRoutes); 

module.exports = app;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
