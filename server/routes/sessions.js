const express = require('express');
const router  = express.Router();
const { getSessions, createSession, deleteSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getSessions).post(createSession);
router.route('/:id').delete(deleteSession);

module.exports = router;
