const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./models/User');

const emailToPromote = 'ramanchourasiya2005@gmail.com'; // Derived from screenshot

async function promoteUser() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const user = await User.findOne({ where: { email: emailToPromote } });

        if (!user) {
            console.log(`User with email ${emailToPromote} not found.`);
            // List all users to help debug
            const allUsers = await User.findAll();
            console.log('Available users:', allUsers.map(u => u.email));
            return;
        }

        user.role = 'admin';
        await user.save();

        console.log(`Successfully promoted ${user.email} to admin.`);
    } catch (error) {
        console.error('Error promoting user:', error);
    } finally {
        await sequelize.close();
    }
}

promoteUser();
