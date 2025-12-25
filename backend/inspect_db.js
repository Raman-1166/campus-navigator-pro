const sequelize = require('./database');
const User = require('./models/User');

const inspect = async () => {
    try {
        await sequelize.authenticate();
        console.log('--- Database Inspection ---');

        const users = await User.findAll();
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            console.log(`Found ${users.length} user(s):`);
            users.forEach(u => {
                console.log(`- ID: ${u.id}`);
                console.log(`  Email: ${u.email}`);
                console.log(`  Role: ${u.role}`);
                console.log(`  GoogleID: ${u.googleId ? 'Linked' : 'None'}`);
                console.log(`  PasswordHash: ${u.password ? 'Set' : 'Null'}`);
                console.log('---------------------------');
            });
        }
    } catch (error) {
        console.error('Inspection error:', error);
    } finally {
        await sequelize.close();
    }
};

inspect();
