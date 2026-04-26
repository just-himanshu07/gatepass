const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  parentPhone: { type: String },
  relation: { type: String },
  departureTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'out', 'returned', 'used'], 
    default: 'pending' 
  },
  passId: { type: String, unique: true, required: true },
  approvalDetails: {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date }
  },
  usageDetails: {
    exitGuard: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    exitTime: { type: Date },
    entryGuard: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    entryTime: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GatePass', gatePassSchema);
