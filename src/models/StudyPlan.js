const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studyPlan: { type: String, required: true },
  examDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
