const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Use absolute path for SQLite DB to check consistent location regardless of CWD
const dbPath = path.join(__dirname, 'database.sqlite');

const sequelize = process.env.POSTGRES_URL
    ? new Sequelize(process.env.POSTGRES_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Required for Vercel Postgres
            },
        },
    })
    : new Sequelize({
        dialect: 'sqlite',
        // On Vercel (read-only), fall back to memory to prevent crash if Postgres missing.
        storage: process.env.VERCEL ? ':memory:' : dbPath, // Use absolute path
        logging: false,
    });

module.exports = sequelize;
