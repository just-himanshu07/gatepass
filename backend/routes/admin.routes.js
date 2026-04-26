const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');

router.get('/pending-users', auth, adminController.getPendingUsers);
router.put('/approve-user/:id', auth, adminController.approveUser);
router.delete('/reject-user/:id', auth, adminController.rejectUser);

module.exports = router;
