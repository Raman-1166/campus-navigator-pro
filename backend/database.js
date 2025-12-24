const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

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
        storage: process.env.VERCEL ? ':memory:' : './database.sqlite',
        logging: false,
    });

module.exports = sequelize;
