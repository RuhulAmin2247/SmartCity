// MySQL connection এর জন্য sequelize library আনছি
const { Sequelize } = require('sequelize');

// .env থেকে database info নিয়ে connection তৈরি করছি
const sequelize = new Sequelize(
  process.env.DB_NAME,     // database নাম: smartcity
  process.env.DB_USER,     // user: root
  process.env.DB_PASSWORD, // তোমার password
  {
    host: process.env.DB_HOST, // localhost
    dialect: 'mysql',          // আমরা mysql ব্যবহার করছি
    logging: false,            // console এ SQL query দেখাবে না
  }
);

// Connection test করার function
const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected! ✅');
    
    // সব model অনুযায়ী table auto তৈরি করবে
    await sequelize.sync({ alter: true });
    console.log('MySQL tables ready! ✅');
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
  }
};

// অন্য file এ ব্যবহার করার জন্য export করছি
module.exports = { sequelize, connectMySQL };