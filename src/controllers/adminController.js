const User = require('../models/User');
const StudyMaterial = require('../models/Material');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const StudyPlan = require('../models/StudyPlan');

async function listUsers(req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
}

async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await Promise.all([
    StudyMaterial.deleteMany({ userId: user._id }),
    Summary.deleteMany({ userId: user._id }),
    Flashcard.deleteMany({ userId: user._id }),
    Quiz.deleteMany({ userId: user._id }),
    StudyPlan.deleteMany({ userId: user._id })
  ]);
  res.json({ message: 'User and related resources deleted' });
}

async function stats(req, res) {
  const [users, materials, summaries, flashcards, quizzes, studyPlans] = await Promise.all([
    User.countDocuments(),
    StudyMaterial.countDocuments(),
    Summary.countDocuments(),
    Flashcard.countDocuments(),
    Quiz.countDocuments(),
    StudyPlan.countDocuments()
  ]);
  res.json({ users, materials, summaries, flashcards, quizzes, studyPlans });
}

module.exports = { listUsers, deleteUser, stats };
