const sequelize = require('./database');
const { College, Building, Floor, Room } = require('./models/DataModels');

const seedData = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Ensure tables match new schema

        console.log('Seeding data...');

        // Check if data exists
        const existingCollege = await College.findOne({ where: { name: 'Engineering Campus' } });
        if (existingCollege) {
            console.log('Test data already exists.');
            return;
        }

        // 1. Create College
        const college = await College.create({
            name: 'Engineering Campus',
            address: '123 University Road'
        });
        console.log('Created College:', college.name);

        // 2. Create Building
        const building = await Building.create({
            name: 'Main Block',
            code: 'MB',
            collegeId: college.id
        });
        console.log('Created Building:', building.name);

        // 3. Create Floors
        const groundFloor = await Floor.create({
            name: 'Ground Floor',
            floorNumber: 0,
            buildingId: building.id
        });
        console.log('Created Floor:', groundFloor.name);

        const firstFloor = await Floor.create({
            name: 'First Floor',
            floorNumber: 1,
            buildingId: building.id
        });
        console.log('Created Floor:', firstFloor.name);

        // 4. Create Rooms
        await Room.create({
            name: 'Room 101',
            type: 'classroom',
            floorId: groundFloor.id,
            coordinates: '100,100' // Placeholder
        });
        await Room.create({
            name: 'Central Library',
            type: 'library',
            floorId: groundFloor.id,
            coordinates: '300,100'
        });
        await Room.create({
            name: 'Computer Lab 201',
            type: 'laboratory',
            floorId: firstFloor.id,
            coordinates: '100,100'
        });

        console.log('Seeding complete!');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await sequelize.close();
    }
};

seedData();
