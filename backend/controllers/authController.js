const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Allow role selection for demo purposes. 
        // In strict prod, role should default to 'user' or be assigned by admin.
        const userRole = role === 'admin' ? 'admin' : 'user';

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: userRole
        });

        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If user has no password (e.g. Google-only), deny password login
        if (!user.password) {
            return res.status(400).json({ message: 'Please log in with Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role, profilePicture: user.profilePicture } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        console.log('--- DBG: GOOGLE LOGIN ATTEMPT ---');
        console.log('DBG: ENV GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 50) + '...' : 'UNDEFINED');
        console.log('DBG: Received Token Length:', token?.length);

        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error('CRITICAL ERROR: GOOGLE_CLIENT_ID is not set in the backend environment variables.');
            return res.status(500).json({ message: 'Server configuration error: GOOGLE_CLIENT_ID missing' });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log('DBG: Token Verified Successfully');
        console.log('DBG: Payload Email:', payload.email);
        console.log('DBG: Payload Audience:', payload.aud);

        const { name, email, picture, email_verified, sub: googleId } = payload;

        if (!email_verified) {
            console.log('DBG: Email not verified by Google');
            return res.status(400).json({ message: 'Email not verified by Google' });
        }

        let user = await User.findOne({ where: { email } });

        if (user) {
            console.log('DBG: Existing user found:', user.email);
            // Update googleId and picture if missing
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            if (!user.profilePicture) {
                user.profilePicture = picture;
                await user.save();
            }
        } else {
            console.log('DBG: Creating new user for:', email);
            // Create new user
            user = await User.create({
                email,
                googleId,
                profilePicture: picture,
                role: 'user', // Default role
                // password is valid to be null
            });
        }

        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token: jwtToken, user: { id: user.id, email: user.email, role: user.role, profilePicture: user.profilePicture } });

    } catch (error) {
        console.error("DBG: Google Login Error:", error.message);
        console.log('--- DBG: ERROR DETAILS ---');
        console.log('Full Error:', error);

        // Specific help for common errors
        if (error.message.includes('audience mismatch')) {
            console.log('CRITICAL: AUDIENCE MISMATCH');
            console.log('Backend expects client ID:', process.env.GOOGLE_CLIENT_ID);
            console.log('But the token was issued for a different client ID.');
            console.log('Make sure frontend VITE_GOOGLE_CLIENT_ID matches backend GOOGLE_CLIENT_ID exactly.');
        }

        res.status(500).json({ message: 'Google login failed', error: error.message });
    }
};

module.exports = { login, googleLogin }; // Register removed from public API
