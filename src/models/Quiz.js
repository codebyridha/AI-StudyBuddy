const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: String, required: true }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyMaterial', required: true, unique: true },
  questions: { type: [questionSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
