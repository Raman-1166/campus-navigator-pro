const sequelize = require('./database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const debug = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const email = 'raman@example.com';
        const password = 'ramanpassword';

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User NOT found:', email);
            return;
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Trying to re-hash...');
            const newHash = await bcrypt.hash(password, 10);
            console.log('New Hash would be:', newHash);
        }

    } catch (error) {
        console.error('Debug error:', error);
    } finally {
        await sequelize.close();
    }
};

debug();
