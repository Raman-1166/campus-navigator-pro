const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const { Connection } = require('./models/DataModels');
app.get('/api/debug/connections', async (req, res) => {
    try {
        const connections = await Connection.findAll();
        res.json(connections);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
    res.send('Campus Navigator Backend is running');
});

// Database Sync and Start Server
// Database Sync and Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync database (be careful in production with force: true)
        await sequelize.sync();

        // Only start server if running directly
        if (require.main === module) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();

module.exports = app;

