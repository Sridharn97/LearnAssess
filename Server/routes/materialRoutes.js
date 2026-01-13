import express from 'express';
import Material from '../models/Material.js';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage, cloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all materials
router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find().populate('createdBy', 'name');
    res.json(materials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single material
router.get('/:id', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('createdBy', 'name');
    if (material) {
      res.json(material);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create material (admin only)
router.post('/', protect, admin, upload.single('file'), async (req, res) => {
  try {
    const materialData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      createdBy: req.user._id
    };

    if (req.file) {
      // PDF upload (Cloudinary)
      materialData.file = req.file.path; // Cloudinary URL
      materialData.publicId = req.file.filename; // Cloudinary Public ID
      materialData.fileName = req.file.originalname;
      materialData.fileSize = req.file.size;
      materialData.contentType = 'pdf';
    } else {
      // Text content
      materialData.content = req.body.content;
      materialData.contentType = 'text';
    }

    const material = await Material.create(materialData);
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update material (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (material) {
      material.title = req.body.title || material.title;
      material.description = req.body.description || material.description;
      material.content = req.body.content || material.content;
      material.category = req.body.category || material.category;

      const updatedMaterial = await material.save();
      res.json(updatedMaterial);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete material (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (material) {
      if (material.publicId) {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(material.publicId, { resource_type: 'raw' });
      }

      await material.deleteOne();
      res.json({ message: 'Material removed' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Serve PDF files
router.get('/:id/pdf', protect, async (req, res) => {
  try {
    console.log(`PDF request for material ID: ${req.params.id}`);

    const material = await Material.findById(req.params.id);
    console.log('Material found:', material ? {
      id: material._id,
      title: material.title,
      contentType: material.contentType,
      file: material.file ? 'present' : 'missing',
      publicId: material.publicId ? 'present' : 'missing'
    } : 'null');

    if (!material) {
      console.log('Material not found');
      return res.status(404).json({
        message: 'Material not found',
        materialId: req.params.id
      });
    }

    if (material.contentType !== 'pdf') {
      console.log(`Material is not a PDF, contentType: ${material.contentType}`);
      return res.status(404).json({
        message: 'Material is not a PDF',
        contentType: material.contentType,
        materialId: req.params.id
      });
    }

    if (!material.file) {
      console.log('Material file field is empty');
      return res.status(404).json({
        message: 'PDF file reference is missing',
        materialId: req.params.id
      });
    }

    console.log(`Material file: ${material.file.substring(0, 50)}...`);

    // Check if it's a Cloudinary URL
    if (material.file.startsWith('http')) {
      console.log('Redirecting to Cloudinary URL');
      return res.redirect(material.file);
    }

    // Fallback for local legacy files
    console.log('Checking for local file:', material.file);
    if (fs.existsSync(material.file)) {
      console.log('Serving local PDF file');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${material.fileName}"`);
      const fileStream = fs.createReadStream(material.file);
      fileStream.pipe(res);
    } else {
      console.log('Local PDF file not found on filesystem');
      res.status(404).json({
        message: 'PDF file not found on server',
        filePath: material.file,
        materialId: req.params.id
      });
    }
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({
      message: 'Server error while serving PDF',
      error: error.message,
      materialId: req.params.id
    });
  }
});

export default router;