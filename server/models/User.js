const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: { type: String, required: true, trim: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving (no salt)
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = crypto.createHash('sha256').update(this.password).digest('hex');
    console.log('Password hashed successfully:', this.password);
    next();
  } catch (err) {
    console.error('Hashing error:', err.message, err.stack);
    next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = function (candidatePassword) {
  try {
    const hashedCandidate = crypto.createHash('sha256').update(candidatePassword).digest('hex');
    const isMatch = this.password === hashedCandidate;
    console.log('Password comparison:', { candidate: hashedCandidate, stored: this.password, match: isMatch });
    return isMatch;
  } catch (err) {
    console.error('Comparison error:', err.message, err.stack);
    throw err;
  }
};

module.exports = mongoose.model('User', userSchema);
