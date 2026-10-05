const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  // Public registration creates student accounts. Admin accounts should be promoted securely in the database.
  const user = await User.create({ name, email, password, role: 'student' });
  const token = createToken(user);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    message: 'Login successful',
    token: createToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}

module.exports = { register, login };
