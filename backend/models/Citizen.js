// PostgreSQL connection আনছি
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

// Citizen table এর structure define করছি
const Citizen = sequelize.define('Citizen', {

  // Primary key — auto increment
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // পুরো নাম
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // NID নম্বর — unique হতে হবে
  nid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // Email — login এর জন্য
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // Password — encrypted রাখব
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // ফোন নম্বর
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // জন্মতারিখ
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  // Ward নম্বর — কোন এলাকায় থাকে
  ward_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // পূর্ণ ঠিকানা
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // Profile photo
  photo: {
    type: DataTypes.STRING,
    defaultValue: 'default.jpg',
  },

  // QR code — unique citizen card এর জন্য
  qr_code: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Account active আছে কিনা
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  // Role — citizen, staff, admin, superadmin
  role: {
    type: DataTypes.ENUM('citizen', 'staff', 'admin', 'superadmin'),
    defaultValue: 'citizen',
  },

}, {
  // Table নাম
  tableName: 'citizens',
  // createdAt, updatedAt auto add হবে
  timestamps: true,
});

// অন্য file এ ব্যবহারের জন্য export করছি
module.exports = Citizen;