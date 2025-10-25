import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface CertificateData {
  name: string;
  workshopName: string;
  collegeName: string;
  date: string;
}

export async function generateCertificate(templateUrl: string, data: CertificateData) {
  // Use response.arrayBuffer() to get raw bytes
  const response = await fetch(templateUrl, { method: "GET" });
  
  if (!response.ok) throw new Error("Failed to fetch PDF template");

  const existingPdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Example positions
  page.drawText(data.name, { x: 200, y: 300, size: 18, font, color: rgb(0, 0, 0) });
  page.drawText(data.workshopName, { x: 200, y: 270, size: 14, font });
  page.drawText(data.collegeName, { x: 200, y: 240, size: 12, font });
  page.drawText(data.date, { x: 200, y: 210, size: 12, font });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
