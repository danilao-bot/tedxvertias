const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const CERTIFICATES_DIR = path.join(__dirname, '..', 'certificates');
const CONFIG_PATH = path.join(CERTIFICATES_DIR, 'config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to load certificate config:', err.message);
  }
  return null;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}

async function generateCertificateFromTemplate(userData, category) {
  const config = loadConfig();
  if (!config) {
    throw new Error('Certificate config not found. Ensure server/certificates/config.json exists.');
  }

  // Determine template file
  const templates = config.templates || {};
  const templateFile = templates[category] || templates.default;

  if (!templateFile) {
    throw new Error(`No certificate template found for category: ${category}. Please upload a template image to server/certificates/`);
  }

  const templatePath = path.join(CERTIFICATES_DIR, templateFile);

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Template file not found: ${templateFile}. ` +
      `Please place the certificate image in server/certificates/${templateFile}`
    );
  }

  // Create PDF
  const pdfDoc = await PDFDocument.create();

  // Load and embed image
  const imageBytes = fs.readFileSync(templatePath);
  const ext = path.extname(templateFile).toLowerCase();

  let image;
  if (ext === '.png') {
    image = await pdfDoc.embedPng(imageBytes);
  } else if (ext === '.jpg' || ext === '.jpeg') {
    image = await pdfDoc.embedJpg(imageBytes);
  } else {
    throw new Error(`Unsupported template format: ${ext}. Use PNG or JPG.`);
  }

  const { width, height } = image;
  const page = pdfDoc.addPage([width, height]);

  // Draw template image as background
  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });

  // Draw participant name
  const pos = config.namePosition || {};
  const fontSize = pos.fontSize || 42;
  const fontName = pos.font || 'HelveticaBold';
  const colorHex = pos.color || '#1a1a1a';
  const { r, g, b } = hexToRgb(colorHex);

  let font;
  switch (fontName) {
    case 'TimesRoman':
      font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      break;
    case 'TimesRomanBold':
      font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      break;
    case 'Helvetica':
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      break;
    case 'HelveticaBold':
    default:
      font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      break;
  }

  const name = userData.full_name || 'Participant';
  const textWidth = font.widthOfTextAtSize(name, fontSize);

  let x = pos.x !== undefined ? pos.x : width / 2;
  if (pos.centered !== false) {
    x = x - textWidth / 2;
  }

  const y = pos.y !== undefined ? pos.y : height / 2;

  page.drawText(name, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(r, g, b),
  });

  // Save to temp file
  const fileName = `certificate_${userData.id}_${Date.now()}.pdf`;
  const tempDir = path.join(__dirname, '..', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const outputPath = path.join(tempDir, fileName);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
}

// Legacy programmatic generator (fallback if no templates)
const generateCertificateProgrammatic = async (userData, category) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const redColor = rgb(235 / 255, 0 / 255, 40 / 255);
  const darkColor = rgb(26 / 255, 26 / 255, 26 / 255);
  const grayColor = rgb(102 / 255, 102 / 255, 102 / 255);
  const goldColor = rgb(212 / 255, 175 / 255, 55 / 255);

  page.drawRectangle({
    x: 20, y: 20, width: width - 40, height: height - 40,
    borderColor: redColor, borderWidth: 8,
  });
  page.drawRectangle({
    x: 35, y: 35, width: width - 70, height: height - 70,
    borderColor: goldColor, borderWidth: 2,
  });
  page.drawText('TEDx', {
    x: width / 2 - 60, y: height - 120, size: 48,
    font: helveticaBoldFont, color: redColor,
  });
  page.drawText('VeritasUniversity', {
    x: width / 2 - 140, y: height - 170, size: 24,
    font: helveticaFont, color: darkColor,
  });
  page.drawText('CERTIFICATE OF ATTENDANCE', {
    x: width / 2 - 180, y: height - 250, size: 28,
    font: timesRomanBoldFont, color: darkColor,
  });
  page.drawText(`[${category.toUpperCase()} CATEGORY]`, {
    x: width / 2 - 70, y: height - 290, size: 12,
    font: helveticaFont, color: redColor,
  });
  page.drawText('This is to certify that', {
    x: width / 2 - 80, y: height - 350, size: 16,
    font: timesRomanFont, color: grayColor,
  });

  const nameSize = Math.min(42, 400 / userData.full_name.length);
  page.drawText(userData.full_name, {
    x: width / 2 - (userData.full_name.length * nameSize) / 4,
    y: height - 410, size: nameSize,
    font: timesRomanBoldFont, color: darkColor,
  });

  page.drawLine({
    start: { x: width / 2 - 150, y: height - 425 },
    end: { x: width / 2 + 150, y: height - 425 },
    thickness: 1, color: goldColor,
  });
  page.drawText('attended TEDxVeritasUniversity', {
    x: width / 2 - 120, y: height - 460, size: 14,
    font: timesRomanFont, color: grayColor,
  });
  page.drawText('NEO-INTELLIGENCE', {
    x: width / 2 - 100, y: height - 500, size: 24,
    font: helveticaBoldFont, color: redColor,
  });
  page.drawText('Shaping an Intelligent Africa Through Innovation and Culture', {
    x: width / 2 - 220, y: height - 530, size: 10,
    font: helveticaFont, color: grayColor,
  });
  page.drawText('May 16, 2026', {
    x: width / 2 - 50, y: height - 570, size: 14,
    font: helveticaFont, color: darkColor,
  });
  page.drawText('Veritas University, Abuja, Nigeria', {
    x: width / 2 - 120, y: height - 590, size: 10,
    font: helveticaFont, color: grayColor,
  });
  page.drawText('Licensed by TED • This certificate verifies attendance at TEDxVeritasUniversity', {
    x: width / 2 - 200, y: 30, size: 8,
    font: helveticaFont, color: grayColor,
  });

  const fileName = `certificate_${userData.id}_${Date.now()}.pdf`;
  const tempDir = path.join(__dirname, '..', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const outputPath = path.join(tempDir, fileName);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
};

const generateCertificate = async (userData, category) => {
  try {
    return await generateCertificateFromTemplate(userData, category);
  } catch (err) {
    console.warn('Image template failed, falling back to programmatic certificate:', err.message);
    return generateCertificateProgrammatic(userData, category);
  }
};

module.exports = { generateCertificate, generateCertificateFromTemplate };
