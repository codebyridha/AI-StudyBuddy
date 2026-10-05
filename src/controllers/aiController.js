const StudyMaterial = require('../models/Material');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const StudyPlan = require('../models/StudyPlan');
const { generateContent } = require('../utils/gemini');

async function getMaterialForUser(materialId, userId) {
  const material = await StudyMaterial.findOne({ _id: materialId, userId });
  if (!material) {
    const error = new Error('Study material not found');
    error.status = 404;
    throw error;
  }
  if (!material.content) {
    const error = new Error('This material has no text content. Upload/paste text content before using AI generation.');
    error.status = 400;
    throw error;
  }
  return material;
}

async function summarize(req, res) {
  const material = await getMaterialForUser(req.params.id, req.user._id);
  const prompt = `You are an educational assistant. Summarize the following study material in simple language. Use headings and concise bullet points. Focus on exam-relevant concepts.\n\nStudy material:\n${material.content}`;
  const summaryText = await generateContent(prompt);
  const summary = await Summary.findOneAndUpdate(
    { materialId: material._id },
    { userId: req.user._id, materialId: material._id, summary: summaryText },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json({ message: 'Summary generated', summary });
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/gi, '').trim();
  const start = Math.min(...[cleaned.indexOf('['), cleaned.indexOf('{')].filter(i => i >= 0));
  if (start === Infinity) throw new Error('AI did not return valid JSON');
  return JSON.parse(cleaned.slice(start));
}

async function flashcards(req, res) {
  const material = await getMaterialForUser(req.body.materialId, req.user._id);
  const count = Math.min(Math.max(Number(req.body.count) || 10, 3), 20);
  const prompt = `Create ${count} study flashcards from this material. Return ONLY a JSON array of objects with exactly these keys: question, answer. No markdown.\n\n${material.content}`;
  const raw = await generateContent(prompt);
  const cards = extractJson(raw);
  await Flashcard.deleteMany({ materialId: material._id, userId: req.user._id });
  const saved = await Flashcard.insertMany(cards.map(card => ({
    userId: req.user._id,
    materialId: material._id,
    question: card.question,
    answer: card.answer
  })));
  res.json({ message: 'Flashcards generated', flashcards: saved });
}

async function quiz(req, res) {
  const material = await getMaterialForUser(req.body.materialId, req.user._id);
  const count = Math.min(Math.max(Number(req.body.count) || 10, 3), 20);
  const prompt = `Create ${count} multiple-choice questions from this material. Return ONLY JSON with this exact structure: {"questions":[{"question":"...","options":["A","B","C","D"],"answer":"..."}]}. No markdown.\n\n${material.content}`;
  const raw = await generateContent(prompt);
  const parsed = extractJson(raw);
  const questions = parsed.questions || parsed;
  await Quiz.findOneAndDelete({ materialId: material._id, userId: req.user._id });
  const saved = await Quiz.create({ userId: req.user._id, materialId: material._id, questions });
  res.json({ message: 'Quiz generated', quiz: saved });
}

async function studyPlan(req, res) {
  const { goals, availableHours, examDate, subjects } = req.body;
  if (!goals || !availableHours || !examDate) {
    return res.status(400).json({ message: 'goals, availableHours and examDate are required' });
  }
  const prompt = `Create a practical personalized study plan for a student. Learning goals: ${goals}. Available study time: ${availableHours} hours per day. Exam date: ${examDate}. Subjects: ${subjects || 'Not specified'}. Return a clear day-by-day plan with revision and practice. Use simple language.`;
  const planText = await generateContent(prompt);
  const saved = await StudyPlan.create({ userId: req.user._id, studyPlan: planText, examDate });
  res.status(201).json({ message: 'Study plan generated', studyPlan: saved });
}

module.exports = { summarize, flashcards, quiz, studyPlan };
