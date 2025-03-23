const nodemailer = require("nodemailer");

const sendEmailWithPDF = async (contact, pdfPath) => {
    try {
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
            subject: "Contact Submission",
            text: `Hello ${contact.name},\n\nYour contact submission has been received.`,
            attachments: [{ filename: "contact.pdf", path: pdfPath }],
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error("Failed to send email.");
    }
};

module.exports = sendEmailWithPDF;
