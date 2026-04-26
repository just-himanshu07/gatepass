const express = require('express');
const router = express.Router();
const passController = require('../controllers/pass.controller');
const auth = require('../middleware/auth.middleware');

router.post('/request', auth, passController.requestPass);
router.get('/my', auth, passController.getMyPasses);
router.get('/pending', auth, passController.getPendingPasses);
router.get('/all', auth, passController.getAllPasses);
router.patch('/:id/status', auth, passController.updateStatus);
router.get('/stats', auth, passController.getStats);
router.get('/details/:passId', auth, passController.getPassByPassId);
router.patch('/verify/:passId', auth, passController.verifyPass);

module.exports = router;
