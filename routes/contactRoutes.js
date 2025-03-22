const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const generatePDF = require("../utils/pdfGenerator");
const sendEmailWithPDF = require("../utils/emailService");
const fs = require("fs");

router.post("/", async (req, res) => {
    try {
      // Save contact to database
      const newContact = new Contact(req.body);
      await newContact.save();
  
      // Generate PDF
      const pdfPath = await generatePDF(newContact);
  
      // Send email with PDF attachment
      await sendEmailWithPDF(newContact, pdfPath);
  
      // ✅ Delete the PDF file after sending the email
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
  
      res.status(201).json({ message: "Contact saved & email sent!" });
    } catch (err) {
      console.error("Error:", err);
  
      // Handle errors properly
      res.status(500).json({ error: err.message });
    }
  });


router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get("/download/:id", async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) return res.status(404).json({ error: "Contact not found" });
  
      const pdfPath = await generatePDF(contact);
      res.download(pdfPath, `${contact.name}_contact.pdf`, () => {
        // Delete the temp file after sending
        fs.unlinkSync(pdfPath);
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  

module.exports = router;
