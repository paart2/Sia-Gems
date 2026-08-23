import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure data storage directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const enquiriesFile = path.join(dataDir, 'enquiries.json');
const warrantiesFile = path.join(dataDir, 'warranties.json');
const bespokeFile = path.join(dataDir, 'bespoke.json');

const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// GET Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Sia Gems',
    targetEmail: 'info@siagems.com',
    timestamp: new Date().toISOString()
  });
});

// POST Enquiry Endpoint (Product & General Queries -> info@siagems.com)
app.post('/api/enquire', (req, res) => {
  const { name, email, phone, subject, message, productRef, productName } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const newEnquiry = {
    id: 'SIA-ENQ-' + Date.now().toString(36).toUpperCase(),
    recipientEmail: 'info@siagems.com',
    name,
    email,
    phone: phone || 'Not provided',
    subject: subject || (productName ? `Inquiry for ${productName} (${productRef})` : 'General Inquiry'),
    productName: productName || null,
    productRef: productRef || null,
    message,
    status: 'RECEIVED',
    createdAt: new Date().toISOString()
  };

  const enquiries = readJSON(enquiriesFile);
  enquiries.unshift(newEnquiry);
  writeJSON(enquiriesFile, enquiries);

  console.log(`[ENQUIRY RECEIVED to info@siagems.com] ID: ${newEnquiry.id} from ${email}`);

  return res.status(200).json({
    success: true,
    message: `Thank you, ${name}. Your enquiry for Sia Gems has been routed to info@siagems.com. Our master jewelers will respond within 24 hours.`,
    enquiryId: newEnquiry.id
  });
});

// POST Warranty Registration
app.post('/api/warranty', (req, res) => {
  const { firstName, lastName, phone, email, address, city, state, zipCode, referenceNumber, placeOfPurchase, dateOfPurchase, spouseBirthday, anniversary } = req.body;

  if (!firstName || !lastName || !email || !referenceNumber) {
    return res.status(400).json({ success: false, error: 'First name, last name, email, and reference number are required.' });
  }

  const warrantyRecord = {
    id: 'SIA-WR-' + Math.floor(100000 + Math.random() * 900000),
    firstName,
    lastName,
    phone,
    email,
    address,
    city,
    state,
    zipCode,
    referenceNumber,
    placeOfPurchase: placeOfPurchase || 'Sia Gems Authorized Store',
    dateOfPurchase,
    spouseBirthday,
    anniversary,
    registeredAt: new Date().toISOString(),
    status: 'ACTIVE_LIMITED_LIFETIME'
  };

  const warranties = readJSON(warrantiesFile);
  warranties.unshift(warrantyRecord);
  writeJSON(warrantiesFile, warranties);

  console.log(`[WARRANTY REGISTERED] Code: ${warrantyRecord.id} for Ref ${referenceNumber}`);

  return res.status(200).json({
    success: true,
    message: `Congratulations ${firstName}! Your Limited Lifetime Guarantee is now active for item ${referenceNumber}.`,
    warrantyCode: warrantyRecord.id
  });
});

// POST Bespoke Custom Design Request
app.post('/api/bespoke', (req, res) => {
  const { firstName, lastName, email, phone, jewelryType, visionDescription, budget, metalPreference } = req.body;

  if (!firstName || !lastName || !email || !visionDescription) {
    return res.status(400).json({ success: false, error: 'Name, email, and vision description are required.' });
  }

  const bespokeRecord = {
    id: 'SIA-BESPOKE-' + Date.now().toString(36).toUpperCase(),
    firstName,
    lastName,
    email,
    phone,
    jewelryType: jewelryType || 'Custom Piece',
    visionDescription,
    budget: budget || 'To be discussed',
    metalPreference: metalPreference || 'Gold',
    createdAt: new Date().toISOString(),
    status: 'CONSULTATION_SCHEDULED'
  };

  const bespokeList = readJSON(bespokeFile);
  bespokeList.unshift(bespokeRecord);
  writeJSON(bespokeFile, bespokeList);

  console.log(`[BESPOKE REQUEST] ID: ${bespokeRecord.id} from ${email}`);

  return res.status(200).json({
    success: true,
    message: `Thank you ${firstName}! Your Bespoke Custom Design consultation has been logged. Our design concierge will reach out to schedule your 3D modeling session.`,
    consultationId: bespokeRecord.id
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`✨ Sia Gems Backend Server running on http://localhost:${PORT}`);
  console.log(`📧 Directing enquiries to: info@siagems.com`);
});
