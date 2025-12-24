const sequelize = require('./database');
const { Room, Connection } = require('./models/DataModels');

async function connectRooms() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models to ensure Connections table exists
        await sequelize.sync();
        console.log('Database synced.');

        // Get all rooms
        const rooms = await Room.findAll();
        console.log(`Found ${rooms.length} rooms.`);

        // Group by floor
        const roomsByFloor = {};
        rooms.forEach(room => {
            if (!roomsByFloor[room.floorId]) {
                roomsByFloor[room.floorId] = [];
            }
            roomsByFloor[room.floorId].push(room);
        });

        let count = 0;
        for (const floorId in roomsByFloor) {
            const floorRooms = roomsByFloor[floorId];
            if (floorRooms.length < 2) continue;

            console.log(`Connecting ${floorRooms.length} rooms on floor ${floorId}...`);

            for (let i = 0; i < floorRooms.length; i++) {
                for (let j = i + 1; j < floorRooms.length; j++) {
                    const roomA = floorRooms[i];
                    const roomB = floorRooms[j];

                    // Check if connection exists
                    const existing = await Connection.findOne({
                        where: {
                            fromPlaceId: roomA.id,
                            toPlaceId: roomB.id
                        }
                    });

                    if (!existing) {
                        // Create bidirectional connection
                        await Connection.create({
                            fromPlaceId: roomA.id,
                            toPlaceId: roomB.id,
                            distance: 10,
                            type: 'corridor'
                        });
                        await Connection.create({
                            fromPlaceId: roomB.id,
                            toPlaceId: roomA.id,
                            distance: 10,
                            type: 'corridor'
                        });
                        count += 2;
                    }
                }
            }
        }

        console.log(`Created ${count} new connections.`);

    } catch (error) {
        console.error('Error connecting rooms:', error);
    } finally {
        await sequelize.close();
    }
}

connectRooms();
