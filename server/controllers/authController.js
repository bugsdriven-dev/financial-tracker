const crypto = require('crypto');
const sendEmail = require('../config/sendEmail');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, monthlyIncome } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            monthlyIncome: monthlyIncome || 0
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// FORGOT PASSWORD - sends reset link to email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No account found with this email' });
        }

        // Generate random secret token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Save token + expiry (15 minutes) to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Build reset link
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Email content
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
                <h2 style="color: #2563eb;">Password Reset Request 🔑</h2>
                <p>Hi ${user.name},</p>
                <p>You requested to reset your password for your Financial Tracker account.</p>
                <p>Click the button below to set a new password:</p>
                <a href="${resetLink}" 
                   style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;
                          text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0;">
                    Reset My Password
                </a>
                <p style="color:#666;font-size:14px;">⏰ This link will expire in <strong>15 minutes</strong>.</p>
                <p style="color:#666;font-size:14px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                <hr style="margin-top:30px;border:none;border-top:1px solid #eee;">
                <p style="color:#999;font-size:12px;">Financial Habit Builder & Wealth Growth Tracker</p>
            </div>
        `;

        await sendEmail(user.email, 'Reset Your Password - Financial Tracker', html);

        res.json({ message: 'Reset link sent! Check your email inbox.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// RESET PASSWORD - actually sets the new password using token from link
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user with this token AND check it hasn't expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });
        }

        // Encrypt the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful! You can now login with your new password.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getProfile, forgotPassword, resetPassword };