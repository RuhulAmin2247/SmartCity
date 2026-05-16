const Notice = require('../models/Notice');
const Citizen = require('../models/Citizen');

// ─── PUBLISH NOTICE (Admin) ──────────────────────────────────────
const publishNotice = async (req, res) => {
  try {
    const { title, content, category, event_date, ward_no } = req.body;

    const citizen = await Citizen.findByPk(req.citizen.id);

    // Notice তৈরি করছি
    const notice = await Notice.create({
      title,
      content,
      category,
      event_date: event_date || null,
      ward_no:    ward_no || null,
      published_by:   citizen.id,
      publisher_name: citizen.full_name,
    });

    // Socket.IO দিয়ে সবাইকে notify করছি
    const io = req.app.get('io');
    io.emit('new_notice', {
      title,
      category,
      message: `নতুন notice: ${title}`,
    });

    res.status(201).json({
      message: 'Notice publish হয়েছে! ✅',
      notice,
    });

  } catch (error) {
    console.error('Notice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET ALL NOTICES ─────────────────────────────────────────────
const getAllNotices = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { is_active: true };
    if (category) filter.category = category;

    const notices = await Notice.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: notices.length,
      notices,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET SINGLE NOTICE ───────────────────────────────────────────
const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice পাওয়া যায়নি' });
    }

    res.status(200).json({ notice });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── DELETE NOTICE (Admin) ───────────────────────────────────────
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice পাওয়া যায়নি' });
    }

    // Delete না করে inactive করছি
    notice.is_active = false;
    await notice.save();

    res.status(200).json({ message: 'Notice সরিয়ে দেওয়া হয়েছে ✅' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  publishNotice,
  getAllNotices,
  getNotice,
  deleteNotice,
};