const { College, Floor, Room } = require('../models/DataModels');

// --- College CRUD ---
const createCollege = async (req, res) => {
    try {
        const college = await College.create(req.body);
        res.status(201).json(college);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getColleges = async (req, res) => {
    try {
        const colleges = await College.findAll({ include: { model: Floor, include: Room } });
        res.json(colleges);
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

module.exports = {
    createCollege, getColleges, updateCollege, deleteCollege,
    createBuilding, createFloor, createRoom
};
