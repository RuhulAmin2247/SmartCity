// PostgreSQL connection এর জন্য sequelize library আনছি
const { Sequelize } = require('sequelize');

// .env থেকে database info নিয়ে connection তৈরি করছি
const sequelize = new Sequelize(
  process.env.DB_NAME,      // smartcity
  process.env.DB_USER,      // postgres
  process.env.DB_PASSWORD,  // তোমার password
  {
    host: process.env.DB_HOST,   // localhost
    port: process.env.DB_PORT,   // 5432
    dialect: 'postgres',         // postgresql ব্যবহার করছি
    logging: false,
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected! ✅');
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL tables ready! ✅');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
  }
};

module.exports = { sequelize, connectPostgres };