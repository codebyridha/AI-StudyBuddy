const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { summarize } = require('../controllers/aiController');
router.post('/:id/summarize', protect, summarize);
module.exports = router;
