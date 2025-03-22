const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = async (contactData) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, "temp"); // Define temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true }); // Ensure temp directory exists
    }

    const filePath = path.join(tempDir, `${contactData.name}_contact.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // PDF Content
    doc.fontSize(20).text("Contact Information", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${contactData.name}`);
    doc.text(`Email: ${contactData.email}`);
    doc.text(`Message: ${contactData.message}`);

    doc.end();

    // Handle stream events properly
    stream.on("finish", () => resolve(filePath)); // Resolve after writing
    stream.on("error", (err) => reject(err)); // Reject if there's an error
  });
};

module.exports = generatePDF;
