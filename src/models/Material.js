const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  fileName: { type: String },
  filePath: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyMaterial', materialSchema);
