const StudyMaterial = require('../models/Material');
const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function uploadMaterial(req, res) {
  const { title, subject, content = '' } = req.body;

  if (!title || !subject) {
    return res.status(400).json({
      message: 'title and subject are required'
    });
  }

  if (!content && !req.file) {
    return res.status(400).json({
      message: 'Provide content or upload a study material file'
    });
  }

  let extractedContent = content;

  // Extract text from uploaded PDF
  if (req.file && req.file.mimetype === 'application/pdf') {
    try {
      const pdfBuffer = fs.readFileSync(req.file.path);

      const parser = new PDFParse({
        data: pdfBuffer
      });

      const result = await parser.getText();

      extractedContent = result.text;

      await parser.destroy();
    } catch (error) {
      console.error('PDF text extraction error:', error);

      return res.status(500).json({
        message: 'Failed to extract text from PDF'
      });
    }
  }

  const material = await StudyMaterial.create({
    userId: req.user._id,
    title,
    subject,
    content: extractedContent,
    fileName: req.file?.originalname,
    filePath: req.file
      ? `/uploads/${req.file.filename}`
      : undefined
  });

  res.status(201).json({
    message: 'Study material uploaded successfully',
    material
  });
}

async function listMaterials(req, res) {
  const materials = await StudyMaterial
    .find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  res.json({ materials });
}

async function getMaterial(req, res) {
  const material = await StudyMaterial.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!material) {
    return res.status(404).json({
      message: 'Study material not found'
    });
  }

  res.json({ material });
}

async function updateMaterial(req, res) {
  const material = await StudyMaterial.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id
    },
    {
      $set: req.body
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!material) {
    return res.status(404).json({
      message: 'Study material not found'
    });
  }

  res.json({
    message: 'Study material updated',
    material
  });
}

async function deleteMaterial(req, res) {
  const material = await StudyMaterial.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!material) {
    return res.status(404).json({
      message: 'Study material not found'
    });
  }

  res.json({
    message: 'Study material deleted'
  });
}

module.exports = {
  uploadMaterial,
  listMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial
};