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
            to: contact.email,
            subject: "Your Contact Submission",
            text: `Hello ${contact.name},\n\nYour contact submission has been received.`,
            attachments: [{ filename: "contact.pdf", path: pdfPath }],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send email.");
    }
};

module.exports = sendEmailWithPDF;
