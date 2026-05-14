const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const { generateCertificate } = require('../utils/pdfGenerator');
const { sendCertificateEmail } = require('../utils/email');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Multer setup for certificate template uploads
const upload = multer({
  dest: path.join(__dirname, '..', 'certificates'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPG images are allowed'));
    }
  }
});

const CERTIFICATES_DIR = path.join(__dirname, '..', 'certificates');
const CONFIG_PATH = path.join(CERTIFICATES_DIR, 'config.json');

const authenticate = (req, res, next) => {
  const { email, password } = req.headers;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Send certificate to one user
router.post('/send', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate certificate
    const pdfPath = await generateCertificate(user, user.status);
    
    // Send email with Resend (includes category)
    const emailResult = await sendCertificateEmail(user.email, user.full_name, pdfPath, user.status);

    // Clean up temp file
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    // Update database only if email was successful
    if (emailResult.success) {
      await supabase
        .from('registrations')
        .update({ 
          certificate_sent: true, 
          certificate_sent_at: new Date().toISOString() 
        })
        .eq('id', userId);

      res.json({ success: true });
    } else {
      res.status(500).json({ error: emailResult.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send certificates to all pending users (optionally filtered by category)
router.post('/send-all', authenticate, async (req, res) => {
  try {
    const supabase = require('../utils/supabase');
    const { category } = req.body;
    
    // Get users who haven't received certificates
    let query = supabase
      .from('registrations')
      .select('*')
      .eq('certificate_sent', false);
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query = query.eq('status', category);
    }
    
    const { data: users, error: fetchError } = await query;
    
    if (fetchError) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    if (!users || users.length === 0) {
      return res.json({ 
        success: true, 
        message: category && category !== 'all' 
          ? `All certificates already sent for ${category} category`
          : 'All certificates already sent',
        totalUsers: 0 
      });
    }

    // Start background processing
    processCertificatesInBackground(users);
    
    res.json({ 
      success: true, 
      message: `Certificate sending started for ${users.length} users` + 
        (category && category !== 'all' ? ` (${category} category)` : ''),
      totalUsers: users.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get batch status
router.get('/status', authenticate, async (req, res) => {
  res.json(batchStatus);
});

// Reset batch status
router.post('/reset', authenticate, async (req, res) => {
  batchStatus = {
    isRunning: false,
    processed: 0,
    total: 0,
    successful: 0,
    failed: 0,
    errors: []
  };
  res.json({ success: true });
});

// Upload certificate template
router.post('/upload-template', authenticate, upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { category } = req.body;
    const targetName = category ? `${category.toLowerCase()}.png` : 'default.png';
    const targetPath = path.join(CERTIFICATES_DIR, targetName);

    // Move uploaded file to target path
    fs.renameSync(req.file.path, targetPath);

    // Update config if category provided
    if (category && fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      config.templates = config.templates || {};
      config.templates[category] = targetName;
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    }

    res.json({
      success: true,
      message: `Template uploaded for ${category || 'default'}`,
      file: targetName
    });
  } catch (error) {
    // Clean up temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Get certificate config
router.get('/config', authenticate, async (req, res) => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return res.status(404).json({ error: 'Config not found' });
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    // List available template files
    const files = fs.readdirSync(CERTIFICATES_DIR).filter(f =>
      f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
    );
    res.json({ config, files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update certificate config (name position, templates mapping)
router.post('/config', authenticate, async (req, res) => {
  try {
    const { namePosition, templates } = req.body;
    let config = {};

    if (fs.existsSync(CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }

    if (namePosition) {
      config.namePosition = { ...config.namePosition, ...namePosition };
    }
    if (templates) {
      config.templates = { ...config.templates, ...templates };
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Preview certificate for a user (generates PDF without sending email)
router.post('/preview', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pdfPath = await generateCertificate(user, user.status);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="preview_${userId}.pdf"`);
    fs.createReadStream(pdfPath).pipe(res);

    // Clean up after sending
    res.on('finish', () => {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Global batch status
let batchStatus = {
  isRunning: false,
  processed: 0,
  total: 0,
  successful: 0,
  failed: 0,
  errors: []
};

// Background processing function
async function processCertificatesInBackground(users) {
  const DELAY_BETWEEN_EMAILS = 60000; // 1 minute between emails
  
  batchStatus = {
    isRunning: true,
    processed: 0,
    total: users.length,
    successful: 0,
    failed: 0,
    errors: []
  };

  try {
    for (const user of users) {
      try {
        const pdfPath = await generateCertificate(user, user.status);
        const emailResult = await sendCertificateEmail(user.email, user.full_name, pdfPath, user.status);
        
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
        
        if (emailResult.success) {
          await supabase
            .from('registrations')
            .update({ 
              certificate_sent: true, 
              certificate_sent_at: new Date().toISOString() 
            })
            .eq('id', user.id);
          
          batchStatus.successful++;
          console.log(`Certificate sent to ${user.email}`);
        } else {
          batchStatus.failed++;
          batchStatus.errors.push(`${user.email}: ${emailResult.error}`);
          console.log(`Failed to send to ${user.email}: ${emailResult.error}`);
          
          // Stop if rate limited
          if (emailResult.error?.includes('550') || emailResult.error?.includes('rate')) {
            batchStatus.errors.push('Rate limit detected. Stopping batch.');
            break;
          }
        }
      } catch (err) {
        batchStatus.failed++;
        batchStatus.errors.push(`${user.email}: ${err.message}`);
      }
      
      batchStatus.processed++;
      
      // Wait between emails
      if (batchStatus.processed < users.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
      }
    }
  } catch (error) {
    console.error('Batch processing error:', error);
  } finally {
    batchStatus.isRunning = false;
    console.log('Batch processing completed');
  }
}

module.exports = router;