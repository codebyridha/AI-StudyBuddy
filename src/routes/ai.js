const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { summarize, flashcards, quiz, studyPlan } = require('../controllers/aiController');

router.use(protect);
router.post('/flashcards', flashcards);
router.post('/quiz', quiz);
router.post('/study-plan', studyPlan);

// Kept exactly as specified in the project document: /api/materials/:id/summarize
module.exports = router;
