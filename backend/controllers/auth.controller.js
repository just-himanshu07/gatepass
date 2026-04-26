const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, phone, parentPhone, hostel, roomNumber } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userCount = await User.countDocuments();
    const isFirstAdmin = role === 'admin' && userCount === 0;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      rollNumber,
      phone,
      parentPhone,
      hostel,
      roomNumber,
      isApproved: role === 'student' || isFirstAdmin
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval by the administrator.' });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role, 
        email: user.email,
        phone: user.phone,
        parentPhone: user.parentPhone,
        rollNumber: user.rollNumber,
        hostel: user.hostel,
        roomNumber: user.roomNumber
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
