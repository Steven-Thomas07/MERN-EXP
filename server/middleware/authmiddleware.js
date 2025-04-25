const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FloristUser = require('../models/FloristUser');

const ProtectRoute = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.id).select('-password');
    if (!user) {
      user = await FloristUser.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ msg: 'User not found' });
      }
    }
    req.user = { id: user._id, username: user.username || user.name, email: user.email };
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

module.exports = ProtectRoute;
