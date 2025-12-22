const sequelize = require('./database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const adminEmail = 'raman@example.com';
        const adminPassword = 'ramanpassword';

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });

        console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        await sequelize.close();
    }
};

seed();
