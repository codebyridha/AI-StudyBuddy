const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadMaterial, listMaterials, getMaterial, updateMaterial, deleteMaterial
} = require('../controllers/materialController');

router.use(protect);
router.post('/upload', upload.single('file'), uploadMaterial);
router.get('/', listMaterials);
router.get('/:id', getMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;
