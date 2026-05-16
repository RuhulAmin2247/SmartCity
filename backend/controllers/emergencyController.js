const Emergency = require('../models/Emergency');
const Citizen = require('../models/Citizen');

// ─── SEND EMERGENCY ALERT ────────────────────────────────────────
const sendAlert = async (req, res) => {
  try {
    const { type, description, location } = req.body;

    const citizen = await Citizen.findByPk(req.citizen.id);
    if (!citizen) {
      return res.status(404).json({ message: 'Citizen পাওয়া যায়নি' });
    }

    // Emergency alert তৈরি করছি
    const emergency = await Emergency.create({
      citizen_id:   citizen.id,
      citizen_name: citizen.full_name,
      type,
      description,
      location,
      ward_no: citizen.ward_no,
    });

    // Socket.IO দিয়ে সব connected admin কে real-time notify করছি
    const io = req.app.get('io');
    io.emit('emergency_alert', {
      message: `🚨 ${type.toUpperCase()} ALERT!`,
      citizen: citizen.full_name,
      location,
      ward_no: citizen.ward_no,
      emergency_id: emergency._id,
      time: new Date(),
    });

    res.status(201).json({
      message: 'Emergency alert পাঠানো হয়েছে! 🚨 সাহায্য আসছে...',
      emergency,
    });

  } catch (error) {
    console.error('Emergency error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET ALL EMERGENCIES (Admin) ─────────────────────────────────
const getAllEmergencies = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const emergencies = await Emergency.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: emergencies.length,
      emergencies,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── UPDATE EMERGENCY STATUS (Admin) ────────────────────────────
const updateEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    const emergency = await Emergency.findById(id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency পাওয়া যায়নি' });
    }

    emergency.status = status;
    emergency.admin_response = admin_response || '';

    if (status === 'resolved') {
      emergency.resolved_at = new Date();
    }

    await emergency.save();

    // Socket.IO দিয়ে citizen কে notify করছি
    const io = req.app.get('io');
    io.emit('emergency_update', {
      emergency_id: id,
      status,
      admin_response,
    });

    res.status(200).json({
      message: 'Emergency status update হয়েছে! ✅',
      emergency,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendAlert, getAllEmergencies, updateEmergency };