const User = require('../models/userModel');

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please login.' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to register user' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful!', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login user' });
  }
};
