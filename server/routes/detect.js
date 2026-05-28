const express = require('express');
const router = express.Router();
const multer = require('multer');
const { detectSingle, detectCompare, detectUpload } = require('../controllers/detectController');
const { optionalAuth } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.c', '.cpp', '.java', '.py', '.zip', '.cc', '.cxx'];
    const ext = require('path').extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Unsupported file type'));
  }
});

router.post('/single', optionalAuth, detectSingle);
router.post('/compare', optionalAuth, detectCompare);
router.post('/upload', optionalAuth, upload.array('files', 10), detectUpload);

module.exports = router;
