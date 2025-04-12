const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");

router.post("/", async (req, res) => {
    const { userId, amount } = req.body;
  
    try {
      const newTransaction = new Transaction({ userId, amount });
      await newTransaction.save();
      res.status(201).json(newTransaction);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userId", "fullName email credit");
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    
    if (transaction.status !== status) {
      transaction.status = status;
      await transaction.save();

      
      if (status === "Approved") {
        await User.findByIdAndUpdate(transaction.userId, {
          $inc: { credit: transaction.amount }
        });
      }
    }

    res.json({ message: `Transaction ${status}`, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/user/:userId",async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await Transaction.find({ userId });
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
