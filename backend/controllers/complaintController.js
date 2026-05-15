const Complaint = require('../models/Complaint');
const Citizen = require('../models/Citizen');

// ─── SUBMIT COMPLAINT ────────────────────────────────────────────
const submitComplaint = async (req, res) => {
  try {
    const { category, description, location } = req.body;

    // Login করা citizen এর info নিচ্ছি middleware থেকে
    const citizen = await Citizen.findByPk(req.citizen.id);
    if (!citizen) {
      return res.status(404).json({ message: 'Citizen পাওয়া যায়নি' });
    }

    // Upload হওয়া photo গুলোর path নিচ্ছি
    const photos = req.files ? req.files.map(f => f.filename) : [];

    // নতুন complaint তৈরি করছি
    const complaint = await Complaint.create({
      citizen_id:   citizen.id,
      citizen_name: citizen.full_name,
      category,
      description,
      ward_no:      citizen.ward_no,
      location,
      photos,
    });

    res.status(201).json({
      message: 'Complaint সফলভাবে submit হয়েছে! ✅',
      complaint,
    });

  } catch (error) {
    console.error('Complaint submit error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET MY COMPLAINTS ───────────────────────────────────────────
const getMyComplaints = async (req, res) => {
  try {
    // শুধু এই citizen এর complaints দেখাবে
    const complaints = await Complaint.find({
      citizen_id: req.citizen.id
    }).sort({ createdAt: -1 }); // নতুনটা আগে

    res.status(200).json({ complaints });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET ALL COMPLAINTS (Admin) ──────────────────────────────────
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, ward_no } = req.query;

    // Filter তৈরি করছি — optional filters
    const filter = {};
    if (status)   filter.status = status;
    if (category) filter.category = category;
    if (ward_no)  filter.ward_no = Number(ward_no);

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: complaints.length,
      complaints,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── UPDATE STATUS (Admin) ───────────────────────────────────────
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comment } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint পাওয়া যায়নি' });
    }

    // Status update করছি
    complaint.status = status;
    complaint.admin_comment = admin_comment || '';

    // Resolve হলে সময় save করছি
    if (status === 'resolved') {
      complaint.resolved_at = new Date();
    }

    await complaint.save();

    res.status(200).json({
      message: 'Status update হয়েছে! ✅',
      complaint,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateStatus,
};