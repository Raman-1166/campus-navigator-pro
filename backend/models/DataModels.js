const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const College = sequelize.define('College', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING },
});

const Building = sequelize.define('Building', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING }, // e.g. "MAB"
    collegeId: {
        type: DataTypes.INTEGER,
        references: { model: College, key: 'id' }
    }
});

const Floor = sequelize.define('Floor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., "Ground Floor", "1st Floor"
    floorNumber: { type: DataTypes.INTEGER, allowNull: false }, // 0, 1, 2...
    buildingId: {
        type: DataTypes.INTEGER,
        references: { model: Building, key: 'id' }
    }
});

const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // "Room 101"
    type: { type: DataTypes.STRING }, // "Classroom", "Lab", "Office"
    floorId: {
        type: DataTypes.INTEGER,
        references: { model: Floor, key: 'id' }
    },
    coordinates: { type: DataTypes.STRING } // JSON string or "x,y"
});

const Connection = sequelize.define('Connection', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fromPlaceId: {
        type: DataTypes.INTEGER,
        references: { model: Room, key: 'id' }
    },
    toPlaceId: {
        type: DataTypes.INTEGER,
        references: { model: Room, key: 'id' }
    },
    distance: { type: DataTypes.FLOAT },
    type: { type: DataTypes.STRING, defaultValue: 'corridor' } // corridor, stairs, lift
});

// Associations
College.hasMany(Building, { foreignKey: 'collegeId' });
Building.belongsTo(College, { foreignKey: 'collegeId' });

Building.hasMany(Floor, { foreignKey: 'buildingId' });
Floor.belongsTo(Building, { foreignKey: 'buildingId' });

Floor.hasMany(Room, { foreignKey: 'floorId' });
Room.belongsTo(Floor, { foreignKey: 'floorId' });

// Connection associations
Room.belongsToMany(Room, { as: 'ConnectedTo', through: Connection, foreignKey: 'fromPlaceId', otherKey: 'toPlaceId' });

module.exports = { College, Building, Floor, Room, Connection };
