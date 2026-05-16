const Citizen = require('../models/Citizen');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Emergency = require('../models/Emergency');
const Notice = require('../models/Notice');

// ─── ADMIN DASHBOARD STATS ───────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {

    // ── Citizen stats ──────────────────────────────────────────
    const totalCitizens = await Citizen.count();

    // ── Complaint stats ────────────────────────────────────────
    const totalComplaints    = await Complaint.countDocuments();
    const pendingComplaints  = await Complaint.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

    // ── Payment stats ──────────────────────────────────────────
    const totalPayments   = await Payment.count();
    const pendingPayments = await Payment.count({ where: { status: 'pending' } });
    const approvedPayments = await Payment.count({ where: { status: 'approved' } });

    // ── Emergency stats ────────────────────────────────────────
    const totalEmergencies  = await Emergency.countDocuments();
    const activeEmergencies = await Emergency.countDocuments({ status: 'active' });

    // ── Notice stats ───────────────────────────────────────────
    const totalNotices = await Notice.countDocuments({ is_active: true });

    // ── Ward wise complaint breakdown ──────────────────────────
    const wardStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$ward_no',
          total: { $sum: 1 },
          pending:  { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        }
      },
      { $sort: { total: -1 } }
    ]);

    // ── Category wise complaint breakdown ──────────────────────
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
        }
      },
      { $sort: { total: -1 } }
    ]);

    // ── Recent complaints ──────────────────────────────────────
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('citizen_name category status location createdAt');

    // ── Recent payments ────────────────────────────────────────
    const recentPayments = await Payment.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['citizen_name', 'bill_type', 'amount', 'status', 'createdAt'],
    });

    res.status(200).json({
      overview: {
        totalCitizens,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalPayments,
        pendingPayments,
        approvedPayments,
        totalEmergencies,
        activeEmergencies,
        totalNotices,
      },
      wardStats,
      categoryStats,
      recentComplaints,
      recentPayments,
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };