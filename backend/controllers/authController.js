// প্রয়োজনীয় packages আনছি
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const Citizen = require('../models/Citizen');

// ─── REGISTER ───────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    // Frontend থেকে আসা data নিচ্ছি
    const {
      full_name, nid, email, password,
      phone, date_of_birth, ward_no, address
    } = req.body;

    // Email আগে থেকে আছে কিনা চেক করছি
    const existingEmail = await Citizen.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'এই email দিয়ে আগেই account আছে' });
    }

    // NID আগে থেকে আছে কিনা চেক করছি
    const existingNID = await Citizen.findOne({ where: { nid } });
    if (existingNID) {
      return res.status(400).json({ message: 'এই NID দিয়ে আগেই account আছে' });
    }

    // Password encrypt করছি — plain text রাখা নিরাপদ না
    const hashedPassword = await bcrypt.hash(password, 12);

    // নতুন citizen তৈরি করছি
    const citizen = await Citizen.create({
      full_name,
      nid,
      email,
      password: hashedPassword,
      phone,
      date_of_birth,
      ward_no,
      address,
    });

    // QR code বানাচ্ছি — citizen এর unique ID দিয়ে
    const qrData = JSON.stringify({
      id: citizen.id,
      name: citizen.full_name,
      nid: citizen.nid,
      ward: citizen.ward_no,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // QR code save করছি
    await citizen.update({ qr_code: qrCode });

    // JWT token বানাচ্ছি — login এর জন্য
    const token = jwt.sign(
      { id: citizen.id, role: citizen.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Password বাদ দিয়ে response পাঠাচ্ছি
    const { password: _, ...citizenData } = citizen.toJSON();

    res.status(201).json({
      message: 'Registration সফল হয়েছে! 🎉',
      token,
      citizen: citizenData,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email দিয়ে citizen খুঁজছি
    const citizen = await Citizen.findOne({ where: { email } });
    if (!citizen) {
      return res.status(404).json({ message: 'Email বা password ভুল' });
    }

    // Account active আছে কিনা চেক করছি
    if (!citizen.is_active) {
      return res.status(403).json({ message: 'Account টি বন্ধ করা আছে' });
    }

    // Password মিলছে কিনা চেক করছি
    const isMatch = await bcrypt.compare(password, citizen.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email বা password ভুল' });
    }

    // JWT token বানাচ্ছি
    const token = jwt.sign(
      { id: citizen.id, role: citizen.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Password বাদ দিয়ে response পাঠাচ্ছি
    const { password: _, ...citizenData } = citizen.toJSON();

    res.status(200).json({
      message: 'Login সফল! 👋',
      token,
      citizen: citizenData,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET PROFILE ─────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    // Middleware থেকে citizen id নিচ্ছি
    const citizen = await Citizen.findByPk(req.citizen.id, {
      attributes: { exclude: ['password'] } // password বাদ দিচ্ছি
    });

    res.status(200).json({ citizen });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// অন্য file এ ব্যবহারের জন্য export করছি
module.exports = { register, login, getProfile };