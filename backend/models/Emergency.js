const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({

  // কোন citizen alert পাঠিয়েছে
  citizen_id: {
    type: Number,
    required: true,
  },

  citizen_name: {
    type: String,
    required: true,
  },

  // Emergency এর ধরন
  type: {
    type: String,
    enum: ['fire', 'ambulance', 'police', 'flood', 'other'],
    required: true,
  },

  // বিস্তারিত
  description: {
    type: String,
    required: true,
  },

  // অবস্থান
  location: {
    type: String,
    required: true,
  },

  // Ward নম্বর
  ward_no: {
    type: Number,
    required: true,
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'responding', 'resolved'],
    default: 'active',
  },

  // Admin response
  admin_response: {
    type: String,
    default: '',
  },

  // কখন resolve হয়েছে
  resolved_at: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Emergency', emergencySchema);