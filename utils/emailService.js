const nodemailer = require("nodemailer");
const fs = require("fs");

const sendEmailWithPDF = async (contactData, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "md@nusaiba.com.bd",
    subject: "New Contact Submission",
    text: `A new contact has been submitted:\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nMessage: ${contactData.message}`,
    attachments: [
      {
        filename: `${contactData.name}_contact.pdf`,
        path: pdfPath,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmailWithPDF;
