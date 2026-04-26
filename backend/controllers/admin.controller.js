const User = require('../models/User');

exports.getPendingUsers = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const pendingUsers = await User.find({ isApproved: false }).select('-password');
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending users', error: error.message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error approving user', error: error.message });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User request rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting user', error: error.message });
  }
};
