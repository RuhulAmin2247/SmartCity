const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({

  // Notice এর title
  title: {
    type: String,
    required: true,
  },

  // বিস্তারিত content
  content: {
    type: String,
    required: true,
  },

  // Notice এর ধরন
  category: {
    type: String,
    enum: ['general', 'emergency', 'event', 'maintenance', 'holiday'],
    default: 'general',
  },

  // কোন admin publish করেছে
  published_by: {
    type: Number,
    required: true,
  },

  // Publisher এর নাম
  publisher_name: {
    type: String,
    required: true,
  },

  // Notice active আছে কিনা
  is_active: {
    type: Boolean,
    default: true,
  },

  // Event এর তারিখ — optional
  event_date: {
    type: Date,
    default: null,
  },

  // কোন ward এর জন্য — null মানে সব ward
  ward_no: {
    type: Number,
    default: null,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Notice', noticeSchema);