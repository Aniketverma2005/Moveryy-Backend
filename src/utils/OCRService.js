import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs';
//aniket
// Preprocess image for better OCR accuracy
const preprocessImage = async (imagePath) => {
  const processedPath = imagePath + '_processed.png';

  await sharp(imagePath)
    .grayscale()
    .normalize()
    .sharpen()
    .resize(1500, null, { withoutEnlargement: false })
    .toFile(processedPath);

  return processedPath;
};

// Extract raw text from image using Tesseract
export const extractTextFromImage = async (imagePath) => {
  const processedPath = await preprocessImage(imagePath);

  try {
    const { data: { text } } = await Tesseract.recognize(processedPath, 'eng');
    return text;
  } finally {
    if (fs.existsSync(processedPath)) {
      fs.unlinkSync(processedPath);
    }
  }
};

// ─────────────────────────────────────────────
// Extract Driving License details
// ─────────────────────────────────────────────
export const extractDLDetails = (text) => {
  // Normalize - handle both actual newlines and escaped \n
  const normalizedText = text.replace(/\\n/g, '\n');
  const lines = normalizedText.split('\n').map(l => l.trim()).filter(Boolean);
  const today = new Date();

  const result = {
    licenseNumber: null,
    name: null,
    dateOfBirth: null,
    licenseExpiry: null,
    address: null,
    raw: text
  };

  // ── License Number ──
  const licenseMatch = normalizedText.match(/\b[A-Z]{2}\d{2,4}\d{6,9}\b/);
  if (licenseMatch) result.licenseNumber = licenseMatch[0];

  // ── Name from "Name :" label (Delhi DL style) ──
  const nameLabelMatch = normalizedText.match(/[Nn]ame\s*[:]\s*([A-Za-z][A-Za-z\s]+?)(?:\s+[a-z]?\s*\n|\n)/);
  if (nameLabelMatch) {
    result.name = nameLabelMatch[1].trim().replace(/\s+[a-z]$/, '').trim();
  }

  // ── All dates: DD-MM-YYYY or DD/MM/YYYY ──
  const allDates = [...normalizedText.matchAll(/\b(\d{2})[-\/](\d{2})[-\/](\d{4})\b/g)];

  for (const match of allDates) {
    const [full, dd, mm, yyyy] = match;
    const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
    const age = (today - dateObj) / (1000 * 60 * 60 * 24 * 365);

    if (dateObj > today && !result.licenseExpiry) {
      result.licenseExpiry = full;
    }
    if (dateObj < today && age >= 18 && age <= 80 && !result.dateOfBirth) {
      result.dateOfBirth = full;
    }
  }

  // ── DOB from "DOB:" label ──
  if (!result.dateOfBirth) {
    const dobLabelMatch = normalizedText.match(/[Dd][Oo][Bb]\s*[:]\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/);
    if (dobLabelMatch) result.dateOfBirth = dobLabelMatch[1];
  }

  // ── Name from "Holder's Signature" (West Bengal DL style) ──
  if (!result.name) {
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (lineLower.includes('holder') || lineLower.includes('signature')) {
        for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
          const cleaned = lines[j].replace(/^[.\-\s]+/, '').replace(/[.\-\s\d]+$/, '').trim();
          if (
            cleaned.length > 3 &&
            cleaned.length < 60 &&
            /^[A-Za-z\s]+$/.test(cleaned) &&
            !cleaned.toLowerCase().includes('blood') &&
            !cleaned.toLowerCase().includes('organ') &&
            !cleaned.toLowerCase().includes('son') &&
            !cleaned.toLowerCase().includes('daughter')
          ) {
            result.name = cleaned;
            break;
          }
        }
        if (result.name) break;
      }
    }
  }

  // ── Name from line before "S/O", "D/O", "S/W/D" ──
  if (!result.name) {
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (
        lineLower.includes('s/w/d') ||
        lineLower.includes('son/') ||
        lineLower.includes('daughter/') ||
        lineLower.includes('wife of') ||
        lines[i].includes('S/O') ||
        lines[i].includes('D/O')
      ) {
        for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
          const cleaned = lines[j].replace(/^[.\-_\s]+/, '').replace(/[.\-_\s\d]+$/, '').trim();
          if (
            cleaned.length > 3 &&
            /^[A-Za-z\s]+$/.test(cleaned) &&
            !cleaned.toLowerCase().includes('signature') &&
            !cleaned.toLowerCase().includes('blood') &&
            !cleaned.toLowerCase().includes('name')
          ) {
            result.name = cleaned;
            break;
          }
        }
        if (result.name) break;
      }
    }
  }

  // ── Address - capture multiple lines after "Address:" ──
  const addressIdx = normalizedText.search(/[Aa]ddress\s*[:]/);
  if (addressIdx !== -1) {
    const afterAddress = normalizedText.slice(addressIdx).replace(/[Aa]ddress\s*[:]\s*/, '');
    const addressLines = afterAddress.split('\n');
    const collected = [];
    for (const line of addressLines) {
      const trimmed = line.trim();
      if (/^(Authoris|Issue Date|Validity|InvCarr|Holder|Signature)/i.test(trimmed)) break;
      if (trimmed.length <= 2) continue;
      if (/^[-|=\s]{1,4}$/.test(trimmed)) continue;
      const cleaned = trimmed
        .replace(/^[|\-\s]+/, '')
        .replace(/[\s.:|]+$/, '')
        .trim();
      if (cleaned.length > 3) collected.push(cleaned);
    }
    if (collected.length > 0) {
      result.address = collected.join(', ').replace(/\s+/g, ' ').replace(/,\s*,/g, ',').trim();
    }
  }

  return result;
};

// ─────────────────────────────────────────────
// Extract PAN Card details
// ─────────────────────────────────────────────
export const extractPANDetails = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const result = {
    panNumber: null,
    name: null,
    fatherName: null,
    dateOfBirth: null,
    raw: text
  };

  let nameLineIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // PAN Number (e.g., ABCDE1234F)
    const panMatch = line.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
    if (panMatch && !result.panNumber) {
      result.panNumber = panMatch[0];
    }

    // Date of Birth (DD/MM/YYYY or DD-MM-YYYY)
    const dobMatch = line.match(/\b(\d{2}[-\/]\d{2}[-\/]\d{4})\b/);
    if (dobMatch && !result.dateOfBirth) {
      result.dateOfBirth = dobMatch[1];
    }

    // Name - usually all caps line on PAN card
    if (
      line === line.toUpperCase() &&
      line.length > 3 &&
      /^[A-Z\s]+$/.test(line) &&
      !line.includes('INCOME') &&
      !line.includes('INDIA') &&
      !line.includes('GOVT') &&
      !line.includes('TAX') &&
      !line.includes('DEPARTMENT') &&
      !line.includes('PERMANENT')
    ) {
      if (!result.name) {
        result.name = line.trim();
        nameLineIndex = i;
      } else if (nameLineIndex !== -1 && i === nameLineIndex + 1 && !result.fatherName) {
        result.fatherName = line.trim();
      }
    }
  }

  return result;
};

// ─────────────────────────────────────────────
// Extract Aadhar Card details
// ─────────────────────────────────────────────
export const extractAadharDetails = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const result = {
    aadharNumber: null,
    name: null,
    dateOfBirth: null,
    gender: null,
    raw: text
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // ── Aadhar Number ──
    const aadharFull = line.match(/\d{4}\s?\d{4}\s?\d{4}/);
    const aadharMasked = line.match(/[Xx]{4,8}\s?\d{4}/);
    if (aadharFull && !result.aadharNumber) {
      result.aadharNumber = aadharFull[0].replace(/\s/g, '');
    } else if (aadharMasked && !result.aadharNumber) {
      result.aadharNumber = aadharMasked[0].replace(/\s/g, '');
    }

    // ── Date of Birth ──
    const dobISO = line.match(/\b(19|20)\d{2}[-\/]\d{2}[-\/]\d{2}\b/);
    const dobDMY = line.match(/\b\d{2}[-\/]\d{2}[-\/](19|20)\d{2}\b/);
    const dobSpaced = line.match(/\b(19|20)\d{2}\s+\d{2}\s+\d{2}\b/);

    if (dobISO && !result.dateOfBirth) {
      result.dateOfBirth = dobISO[0];
    } else if (dobDMY && !result.dateOfBirth) {
      result.dateOfBirth = dobDMY[0];
    } else if (dobSpaced && !result.dateOfBirth) {
      const parts = dobSpaced[0].split(/\s+/);
      result.dateOfBirth = `${parts[0]}-${parts[1]}-${parts[2]}`;
    }

    // ── Gender ──
    if (lineLower.includes('female')) result.gender = 'female';
    else if (lineLower.includes('male')) result.gender = 'male';

    // ── Name ──
    const isAadhaarLine = lineLower.includes('aadhaar') || lineLower.includes('aadhar');
    const isGovtLine = lineLower.includes('government of india') || lineLower.includes('govt of india');

    if ((isAadhaarLine || isGovtLine) && !result.name) {
      for (let j = i + 1; j < lines.length && j < i + 4; j++) {
        const nextLine = lines[j].trim();
        if (
          nextLine.length > 3 &&
          nextLine.length < 60 &&
          /^[A-Za-z\s\.]+$/.test(nextLine) &&
          !nextLine.toLowerCase().includes('aadhaar') &&
          !nextLine.toLowerCase().includes('aadhar') &&
          !nextLine.toLowerCase().includes('india') &&
          !nextLine.toLowerCase().includes('govt') &&
          !nextLine.toLowerCase().includes('government') &&
          !nextLine.toLowerCase().includes('dob') &&
          !nextLine.toLowerCase().includes('male') &&
          !nextLine.toLowerCase().includes('female') &&
          !nextLine.toLowerCase().includes('address')
        ) {
          result.name = nextLine;
          break;
        }
      }
    }
  }

  return result;
};
