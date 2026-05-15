// MongoDB connection এর জন্য mongoose আনছি
const mongoose = require('mongoose');

// Complaint document এর structure define করছি
const complaintSchema = new mongoose.Schema({

  // কোন citizen এর complaint — PostgreSQL এর id রাখছি
  citizen_id: {
    type: Number,
    required: true,
  },

  // Citizen এর নাম — সহজে দেখার জন্য
  citizen_name: {
    type: String,
    required: true,
  },

  // Complaint এর ধরন
  category: {
    type: String,
    enum: ['road', 'electricity', 'water', 'garbage', 'other'],
    required: true,
  },

  // বিস্তারিত বিবরণ
  description: {
    type: String,
    required: true,
  },

  // Ward নম্বর — কোন এলাকার সমস্যা
  ward_no: {
    type: Number,
    required: true,
  },

  // সমস্যার ঠিকানা
  location: {
    type: String,
    required: true,
  },

  // Photo গুলো — array তে রাখছি, একাধিক photo দেওয়া যাবে
  photos: {
    type: [String],
    default: [],
  },

  // Complaint এর status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending',
  },

  // Admin এর comment — কেন reject বা কী করা হচ্ছে
  admin_comment: {
    type: String,
    default: '',
  },

  // কোন admin handle করছে
  assigned_to: {
    type: Number,
    default: null,
  },

  // কখন resolve হয়েছে
  resolved_at: {
    type: Date,
    default: null,
  },

}, {
  // createdAt, updatedAt auto add হবে
  timestamps: true,
});

// Export করছি
module.exports = mongoose.model('Complaint', complaintSchema);