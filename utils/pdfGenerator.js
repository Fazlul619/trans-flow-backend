const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = async (contact) => {
    return new Promise((resolve, reject) => {
        try {
            const tempDir = path.join(__dirname, "../temp");

            
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
                
            }

            const pdfPath = path.join(tempDir, `${contact.name}_contact.pdf`);
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(pdfPath);

            doc.pipe(stream);
            doc.fontSize(20).text("Contact Information", { align: "center" });
            doc.moveDown();
            doc.text(`Name: ${contact.name}`);
            doc.text(`Email: ${contact.email}`);
            doc.text(`Message: ${contact.message}`);
            doc.end();

            stream.on("finish", () => {
                resolve(pdfPath);
            });

            stream.on("error", (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = generatePDF;
