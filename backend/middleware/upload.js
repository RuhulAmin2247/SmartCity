// File upload এর জন্য multer আনছি
const multer = require('multer');
const path = require('path');

// File কোথায় ও কী নামে save হবে সেটা define করছি
const storage = multer.diskStorage({

  // Save হবে uploads folder এ
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  // File এর নাম: timestamp + original নাম
  // এতে duplicate নাম হবে না
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

// শুধু image file accept করব
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  // File extension চেক করছি
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // File type চেক করছি
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept করো
  } else {
    cb(new Error('শুধু image file upload করা যাবে!'));
  }
};

// Multer configure করছি
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5MB per file
  },
});

module.exports = upload;