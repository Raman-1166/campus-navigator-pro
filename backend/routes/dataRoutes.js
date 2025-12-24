const express = require('express');
const {
    createCollege, getColleges, updateCollege, deleteCollege,
    createFloor, createRoom, getConnections
} = require('../controllers/dataController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes (Read only) - or we can require login for reading too? 
// Prompt says: "User can only view...". Implies login might be needed or public.
// "Ensure unauthenticated users cannot access protected routes."
// "User requirements: User can only view..."
// Usually means VIEW is for Authenticated Users (Role: User | Admin).
// But often generic viewing is public. Let's make it Public for now as it's easier to view.
// Wait, prompt says: "Ensure unauthenticated users cannot access protected routes."
// And "User can only view...".
// It implies Unauthenticated -> No Access? Or Unauthenticated -> Public View?
// "User requirements" section implies "User" role.
// Let's protect READ with verifyToken (Any role), and WRITE with requireAdmin.

// GET - All Colleges (Public)
router.post('/colleges', createCollege);
router.get('/colleges', getColleges);
router.put('/colleges/:id', updateCollege);
router.delete('/colleges/:id', deleteCollege);

router.get('/connections', getConnections);

router.post('/buildings', require('../controllers/dataController').createBuilding);
router.post('/floors', verifyToken, requireAdmin, createFloor);
router.post('/rooms', verifyToken, requireAdmin, createRoom);

module.exports = router;
