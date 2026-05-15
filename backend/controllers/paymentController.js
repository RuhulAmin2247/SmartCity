const Payment = require('../models/Payment');
const Citizen = require('../models/Citizen');

// ─── SUBMIT PAYMENT REQUEST ──────────────────────────────────────
const submitPayment = async (req, res) => {
  try {
    const { bill_type, amount, bill_month } = req.body;

    // Login করা citizen এর info নিচ্ছি
    const citizen = await Citizen.findByPk(req.citizen.id);
    if (!citizen) {
      return res.status(404).json({ message: 'Citizen পাওয়া যায়নি' });
    }

    // নতুন payment request তৈরি করছি
    const payment = await Payment.create({
      citizen_id:   citizen.id,
      citizen_name: citizen.full_name,
      bill_type,
      amount,
      bill_month,
    });

    res.status(201).json({
      message: 'Payment request submit হয়েছে! Admin approve করলে receipt পাবেন ✅',
      payment,
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET MY PAYMENTS ─────────────────────────────────────────────
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { citizen_id: req.citizen.id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ payments });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET ALL PAYMENTS (Admin) ────────────────────────────────────
const getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const payments = await Payment.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      total: payments.length,
      payments,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── APPROVE / REJECT PAYMENT (Admin) ───────────────────────────
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comment } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment পাওয়া যায়নি' });
    }

    // Status update করছি
    payment.status       = status;
    payment.admin_comment = admin_comment || '';
    payment.approved_by  = req.citizen.id;
    payment.approved_at  = new Date();

    // Approve হলে receipt নম্বর generate করছি
    if (status === 'approved') {
      payment.receipt_no = 'RCP-' + Date.now();
    }

    await payment.save();

    res.status(200).json({
      message: status === 'approved'
        ? `Payment approve হয়েছে! Receipt: ${payment.receipt_no} 🎉`
        : 'Payment reject হয়েছে',
      payment,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
};