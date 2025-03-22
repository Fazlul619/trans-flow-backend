const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const generatePDF = require("../utils/pdfGenerator");
const sendEmailWithPDF = require("../utils/emailService");
const fs = require("fs");

router.post("/", async (req, res) => {
  try {
      console.log("Received contact request:", req.body);

      const newContact = new Contact(req.body);
      await newContact.save();
      console.log("Contact saved:", newContact);

      const pdfPath = await generatePDF(newContact);
      console.log("PDF generated at:", pdfPath);

      await sendEmailWithPDF(newContact, pdfPath);
      console.log("Email sent successfully!");

      if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
          console.log("PDF deleted:", pdfPath);
      }

      res.status(201).json({ message: "Contact saved & email sent!" });
  } catch (err) {
      console.error("Error in contact submission:", err);
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
        
        fs.unlinkSync(pdfPath);
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  

module.exports = router;
