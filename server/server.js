const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/product');
const User = require('./models/User');
const FloristUser = require('./models/FloristUser');
const jwt = require('jsonwebtoken');
const ProtectRoute = require('./middleware/authmiddleware');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Forgot Password Route
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Generate reset token
    const resetToken = require('crypto').randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Send email with reset token
    const mailOptions = {
      from: `"Flower Inventory" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use the following token to reset your password:\n\n${resetToken}\n\nThis token is valid for 1 hour.`,
      html: `<p>You requested a password reset. Use the following token to reset your password:</p><p><b>${resetToken}</b></p><p>This token is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    // Return token in response for testing
    res.json({ msg: 'Password reset token sent to email', resetToken });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected successfully at', new Date().toISOString()))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Flower Inventory API' });
});

// Register Route (using SHA256)
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  console.log('Register attempt:', { username, email, rawPassword: password });
  if (!username || !password || !email) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('Existing user found:', existingUser.email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Store password as plain text for easier login (not recommended for production)
    const newUser = new User({ username, password, email: email.toLowerCase() });
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser._id, savedUser.email, 'Password stored as plain text:', savedUser.password);
    res.status(201).json({ msg: 'User created successfully. Please login.' });
  } catch (err) {
    console.error('Register error:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// New API route for Florist User registration with password hashing and JWT token
app.post('/register-florist', async (req, res) => {
  const { name, email, phone, location, password } = req.body;
  console.log('Florist registration attempt:', { name, email, phone, location });
  if (!name || !email || !phone || !location || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  try {
    const existingFlorist = await FloristUser.findOne({ email: email.toLowerCase() });
    if (existingFlorist) {
      console.log('Existing florist found:', existingFlorist.email);
      return res.status(400).json({ msg: 'Florist already registered' });
    }

    const newFlorist = new FloristUser({ name, email: email.toLowerCase(), phone, location, password });
    const savedFlorist = await newFlorist.save();
    console.log('Florist saved successfully:', savedFlorist._id, savedFlorist.email);

    const token = jwt.sign({ id: savedFlorist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ msg: 'Florist registered successfully.', token, user: { id: savedFlorist._id, name: savedFlorist.name, email: savedFlorist.email } });
  } catch (err) {
    console.error('Florist registration error:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// New API route for Florist User login with JWT token generation
app.post('/login-florist', async (req, res) => {
  const { email, password } = req.body;
  console.log('Florist login attempt:', { email });
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }
  try {
    const florist = await FloristUser.findOne({ email: email.toLowerCase() });
    if (!florist) {
      console.log('Florist not found with email:', email);
      return res.status(404).json({ msg: 'Florist not found' });
    }

    const isMatch = await florist.comparePassword(password);
    console.log('Password comparison result:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: florist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token.substring(0, 10) + '...');

    res.json({
      msg: 'Login successful',
      token,
      user: { id: florist._id, name: florist.name, email: florist.email }
    });

  } catch (err) {
    console.error('Florist login error:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Login Route (using SHA256 comparePassword)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, rawPassword: password });
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = user.comparePassword(password);
    console.log('Password comparison result:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token.substring(0, 10) + '...');

    res.json({
      msg: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Validate Token Route
app.get('/validate', ProtectRoute, async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ user: req.user, products });
  } catch (err) {
    console.error('Validate error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Product Routes
app.post('/addproduct', ProtectRoute, async (req, res) => {
  const { name, phno, category, qty } = req.body;
  if (!name || !phno || !category || qty === undefined) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  try {
    const product = await Product.create({ name, phno: Number(phno), category, qty: Number(qty) });
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/viewproduct', ProtectRoute, async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ user: req.user, products });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/findproduct/:id', ProtectRoute, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/editproduct/:id', ProtectRoute, async (req, res) => {
  const { name, phno, category, qty } = req.body;
  if (!name || !phno || !category || qty === undefined) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, phno: Number(phno), category, qty: Number(qty) },
      { new: true }
    );
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/deleteproduct/:id', ProtectRoute, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Removed duplicate declarations of crypto and User modules

// Reset Password Route
app.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  console.log('Reset password request received with token:', resetToken);
  if (!resetToken || !newPassword) return res.status(400).json({ msg: 'Token and new password are required' });

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    console.log('User found for reset token:', user);
    if (!user) return res.status(400).json({ msg: 'Invalid or expired reset token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} at`, new Date().toISOString());
});
