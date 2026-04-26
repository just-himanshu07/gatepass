const GatePass = require('../models/GatePass');
const { nanoid } = require('nanoid');

exports.requestPass = async (req, res) => {
  try {
    const { reason, departureTime, parentPhone, relation } = req.body;
    
    // Check if student already has a pending pass
    const pendingPass = await GatePass.findOne({ student: req.userId, status: 'pending' });
    if (pendingPass) return res.status(400).json({ message: 'You already have a pending pass request' });

    const newPass = new GatePass({
      student: req.userId,
      reason,
      parentPhone,
      relation,
      departureTime,
      passId: `GP-${nanoid(10).toUpperCase()}`
    });

    await newPass.save();
    res.status(201).json(newPass);
  } catch (error) {
    res.status(500).json({ message: 'Failed to request pass', error: error.message });
  }
};

exports.getMyPasses = async (req, res) => {
  try {
    const passes = await GatePass.find({ student: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(passes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch passes', error: error.message });
  }
};

exports.getPendingPasses = async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const passes = await GatePass.find({ status: 'pending' }).populate('student', 'name rollNumber hostel phone parentPhone roomNumber');
    res.status(200).json(passes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending passes', error: error.message });
  }
};

exports.getAllPasses = async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const passes = await GatePass.find().populate('student', 'name rollNumber hostel phone parentPhone roomNumber');
    res.status(200).json(passes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch passes', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const { status } = req.body;
    const pass = await GatePass.findByIdAndUpdate(
      req.params.id, 
      { 
        status, 
        'approvalDetails.admin': req.userId, 
        'approvalDetails.timestamp': Date.now() 
      }, 
      { new: true }
    );
    res.status(200).json(pass);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

exports.getPassByPassId = async (req, res) => {
  try {
    const pass = await GatePass.findOne({ passId: req.params.passId }).populate('student', 'name rollNumber phone parentPhone hostel');
    if (!pass) return res.status(404).json({ message: 'Pass not found' });
    res.status(200).json(pass);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pass details', error: error.message });
  }
};

exports.verifyPass = async (req, res) => {
  try {
    if (req.userRole !== 'guard') return res.status(403).json({ message: 'Unauthorized' });
    
    const pass = await GatePass.findOne({ passId: req.params.passId });
    if (!pass) return res.status(404).json({ message: 'Pass not found' });

    if (pass.status === 'approved') {
      const now = new Date();
      const departureTime = new Date(pass.departureTime);
      const diffInMinutes = Math.abs(now - departureTime) / (1000 * 60);

      if (diffInMinutes > 30) {
        return res.status(400).json({ 
          message: 'Pass validity error', 
          error: `This pass is only valid within 30 minutes of the expected departure (${departureTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}).`
        });
      }

      pass.status = 'used'; // One-time use for exit
      pass.usageDetails.exitGuard = req.userId;
      pass.usageDetails.exitTime = Date.now();
    } else {
      return res.status(400).json({ message: `Pass is already ${pass.status}` });
    }

    await pass.save();
    res.status(200).json(pass);
  } catch (error) {
    console.error('VERIFICATION ERROR:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const stats = await GatePass.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const formattedStats = {
      pending: 0, approved: 0, rejected: 0, used: 0, total: 0
    };
    stats.forEach(s => {
      formattedStats[s._id] = s.count;
      formattedStats.total += s.count;
    });
    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};
