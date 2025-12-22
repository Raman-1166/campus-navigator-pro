const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const College = sequelize.define('College', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING },
});

const Floor = sequelize.define('Floor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., "Ground Floor", "1st Floor"
    level: { type: DataTypes.INTEGER, allowNull: false }, // 0, 1, 2...
    collegeId: {
        type: DataTypes.INTEGER,
        references: { model: College, key: 'id' }
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

// Associations
College.hasMany(Floor, { foreignKey: 'collegeId' });
Floor.belongsTo(College, { foreignKey: 'collegeId' });

Floor.hasMany(Room, { foreignKey: 'floorId' });
Room.belongsTo(Floor, { foreignKey: 'floorId' });

module.exports = { College, Floor, Room };
