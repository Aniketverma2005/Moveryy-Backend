import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiErrors } from '../../utils/ApiErrors.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import {
  extractTextFromImage,
  extractDLDetails,
  extractPANDetails,
  extractAadharDetails
} from '../../utils/OCRService.js';
import IndependentDriver from '../../models/RideHailing/IndependentDriver.js';
import fs from 'fs';
import path from 'path';

// Ensure upload directories exist
const uploadDir = 'uploads/documents';
const dlPhotosDir = 'uploads/dl_photos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(dlPhotosDir)) {
  fs.mkdirSync(dlPhotosDir, { recursive: true });
}

// Helper to save uploaded file and return path
const saveFile = async (file) => {
  const ext = path.extname(file.name);
  const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
  const filePath = path.join(uploadDir, filename);
  await file.mv(filePath);
  return filePath;
};

// ─────────────────────────────────────────────
// Extract DL + Save to Driver's record
// ─────────────────────────────────────────────
export const extractDL = asyncHandler(async (req, res) => {
  const file = req.files?.document || req.files?.Document;

  if (!req.files || !file) {
    throw new ApiErrors(400, 'Please upload a driving license image');
  }

  const filePath = await saveFile(file);
  let permanentDLPath = null;

  try {
    const rawText = await extractTextFromImage(filePath);
    const details = extractDLDetails(rawText);

    // Get driver from token
    const driver = await IndependentDriver.findByPk(req.driver.id);
    if (!driver) throw new ApiErrors(404, 'Driver not found');

    // ── Parse expiry date ──
    let expiryDate = null;
    if (details.licenseExpiry) {
      const expiry = details.licenseExpiry.trim();
      if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(expiry)) {
        const parts = expiry.split(/[\/\-]/);
        expiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (/^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/.test(expiry)) {
        expiryDate = new Date(expiry);
      }
      if (expiryDate && isNaN(expiryDate.getTime())) expiryDate = null;
    }

    // ── Check if license is expired ──
    if (expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        return res.status(400).json(
          new ApiResponse(400, {
            documentType: 'Driving License',
            extracted: details,
            expiryDate: details.licenseExpiry,
            isExpired: true,
          }, `Driving license expired on ${details.licenseExpiry}. Please upload a valid license.`)
        );
      }
    }

    // ── Build update data ──
    const updateData = {};

    if (details.licenseNumber) updateData.licenseNumber = details.licenseNumber;
    if (details.licenseExpiry && expiryDate) updateData.licenseExpiry = expiryDate.toISOString().split('T')[0];
    if (details.name && !driver.fullName) updateData.fullName = details.name.replace(/\s+[a-z]$/, '').trim();

    if (details.dateOfBirth && !driver.dateOfBirth) {
      const dob = details.dateOfBirth.trim();
      if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(dob)) {
        const parts = dob.split(/[\/\-]/);
        const dobDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (!isNaN(dobDate.getTime())) updateData.dateOfBirth = dobDate.toISOString().split('T')[0];
      } else if (/^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/.test(dob)) {
        updateData.dateOfBirth = dob;
      }
    }

    if (details.address && !driver.address) updateData.address = details.address;

    // ── Save DL photo permanently (only if not already saved) ──
    const currentDlPath = driver.getDataValue('dlPhotoPath');
    if (!currentDlPath || currentDlPath === '' || currentDlPath === 'null') {
      const ext = path.extname(file.name) || '.jpg';
      const dlPhotoFilename = `driver_${req.driver.id}_dl${ext}`;
      permanentDLPath = path.join(dlPhotosDir, dlPhotoFilename);
      fs.copyFileSync(filePath, permanentDLPath);
      updateData.dlPhotoPath = permanentDLPath;
    }

    // ── Save to DB using raw update to ensure dlPhotoPath is saved ──
    if (Object.keys(updateData).length > 0) {
      await IndependentDriver.update(updateData, {
        where: { driverId: req.driver.id }
      });
    }

    return res.status(200).json(
      new ApiResponse(200, {
        documentType: 'Driving License',
        extracted: details,
        saved: updateData,
        dlPhotoSaved: !!updateData.dlPhotoPath,
        note: 'Data extracted and saved. Please verify the details.'
      }, 'Driving license details extracted and saved successfully')
    );

  } finally {
    // Always clean up temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

// ─────────────────────────────────────────────
// Extract PAN Card + Save to Driver's record
// ─────────────────────────────────────────────
export const extractPAN = asyncHandler(async (req, res) => {
  const file = req.files?.document || req.files?.Document;

  if (!req.files || !file) {
    throw new ApiErrors(400, 'Please upload a PAN card image');
  }

  const filePath = await saveFile(file);

  try {
    const rawText = await extractTextFromImage(filePath);
    const details = extractPANDetails(rawText);

    // Get driver from token
    const driver = await IndependentDriver.findByPk(req.driver.id);
    if (!driver) throw new ApiErrors(404, 'Driver not found');

    // Save to driver's record only
    const updateData = {};
    if (details.panNumber) updateData.panNumber = details.panNumber;
    if (details.name && !driver.fullName) updateData.fullName = details.name;
    if (details.dateOfBirth && !driver.dateOfBirth) updateData.dateOfBirth = details.dateOfBirth;

    if (Object.keys(updateData).length > 0) {
      await driver.update(updateData);
    }

    return res.status(200).json(
      new ApiResponse(200, {
        documentType: 'PAN Card',
        extracted: details,
        saved: updateData,
        note: 'Data extracted and saved. Please verify the details.'
      }, 'PAN card details extracted and saved successfully')
    );

  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

// ─────────────────────────────────────────────
// Extract Aadhar Card + Save to Driver's record
// ─────────────────────────────────────────────
export const extractAadhar = asyncHandler(async (req, res) => {
  const file = req.files?.document || req.files?.Document;

  if (!req.files || !file) {
    throw new ApiErrors(400, 'Please upload an Aadhar card image');
  }

  const filePath = await saveFile(file);

  try {
    const rawText = await extractTextFromImage(filePath);
    const details = extractAadharDetails(rawText);

    // Get driver from token
    const driver = await IndependentDriver.findByPk(req.driver.id);
    if (!driver) throw new ApiErrors(404, 'Driver not found');

    // Save to driver's record only
    const updateData = {};
    if (details.aadharNumber) updateData.aadharNumber = details.aadharNumber;
    if (details.name && !driver.fullName) updateData.fullName = details.name;
    if (details.dateOfBirth && !driver.dateOfBirth) updateData.dateOfBirth = details.dateOfBirth;
    if (details.gender && !driver.gender) updateData.gender = details.gender;

    if (Object.keys(updateData).length > 0) {
      await driver.update(updateData);
    }

    return res.status(200).json(
      new ApiResponse(200, {
        documentType: 'Aadhar Card',
        extracted: details,
        saved: updateData,
        note: 'Data extracted and saved. Please verify the details.'
      }, 'Aadhar card details extracted and saved successfully')
    );

  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});
