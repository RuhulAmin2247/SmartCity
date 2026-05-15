// PostgreSQL connection আনছি
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

// Payment table এর structure define করছি
const Payment = sequelize.define('Payment', {

  // Primary key
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // কোন citizen এর payment
  citizen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Citizen এর নাম
  citizen_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Bill এর ধরন
  bill_type: {
    type: DataTypes.ENUM('water', 'electricity', 'gas', 'holding_tax', 'trade_license'),
    allowNull: false,
  },

  // কত টাকা
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  // কোন মাসের বিল
  bill_month: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Payment এর status
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },

  // Admin এর comment
  admin_comment: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },

  // কোন admin approve করেছে
  approved_by: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },

  // কখন approve হয়েছে
  approved_at: {
    type: DataTypes.DATE,
    defaultValue: null,
  },

  // Receipt নম্বর — approve হলে generate হবে
  receipt_no: {
    type: DataTypes.STRING,
    defaultValue: null,
  },

}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;