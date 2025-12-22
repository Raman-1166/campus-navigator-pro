const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for Google-only users
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user', // 'user' or 'admin'
        validate: {
            isIn: [['user', 'admin']],
        },
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = User;
