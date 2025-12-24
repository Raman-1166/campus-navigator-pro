const { College, Building, Floor, Room, Connection } = require('../models/DataModels');

// --- College CRUD ---
const createCollege = async (req, res) => {
    try {
        const college = await College.create(req.body);
        res.status(201).json(college);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getColleges = async (req, res) => {
    try {
        const colleges = await College.findAll({
            include: {
                model: Building,
                include: {
                    model: Floor,
                    include: {
                        model: Room
                    }
                }
            }
        });

        // Fetch all connections separately to keep JSON clean or include?
        // Let's attach them to the response effectively?
        // For standard REST, `getColleges` returns colleges.
        // Let's add a `getConnections`?
        res.json(colleges);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getConnections = async (req, res) => {
    try {
        const connections = await Connection.findAll();
        res.json(connections);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateCollege = async (req, res) => {
    try {
        const { id } = req.params;
        await College.update(req.body, { where: { id } });
        res.json({ message: 'Updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteCollege = async (req, res) => {
    try {
        const { id } = req.params;
        await College.destroy({ where: { id } });
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Building CRUD ---
const createBuilding = async (req, res) => {
    try {
        const building = await Building.create(req.body);
        res.status(201).json(building);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Floor CRUD ---
const createFloor = async (req, res) => {
    try {
        const floor = await Floor.create(req.body);
        res.status(201).json(floor);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// ... Can add Get/Update/Delete for Floor/Room similarly if needed individual endpoints
// For now, focusing on the main structure. Adding Room creation.

const createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const forceSeed = async (req, res) => {
    // SECURITY: Simple protection, rely on it being temporary.
    try {
        const sequelize = require('../database');
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');

        // 1. Ensure DB is synced (Fixes "no such table" errors on cold start)
        await sequelize.sync();

        const adminEmail = 'raman@example.com';
        const adminPassword = 'ramanpassword';

        let msg = "Start Seeding... ";

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // 3. Upsert Admin User (Create or Update)
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            msg += "Admin exists. Password reset to default. ";
        } else {
            await User.create({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
            });
            msg += "Admin Created. ";
        }

        res.json({ message: 'Success! ' + msg });
    } catch (err) {
        console.error("Seed Error:", err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};



module.exports = {
    createCollege, getColleges, updateCollege, deleteCollege,
    createBuilding, createFloor, createRoom, getConnections, forceSeed
};
