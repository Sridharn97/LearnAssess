import express from 'express';
import Material from '../models/Material.js';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router = express.Router();

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/materials/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

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

// Serve PDF files (must be before /:id route)
router.get('/:id/pdf', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      console.log(`Material not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Material not found' });
    }

    if (material.contentType !== 'pdf') {
      console.log(`Material ${req.params.id} is not a PDF (contentType: ${material.contentType})`);
      return res.status(404).json({ message: 'Material is not a PDF' });
    }

    if (!material.file) {
      console.log(`Material ${req.params.id} has no file field`);
      return res.status(404).json({ message: 'PDF file not found' });
    }

    console.log(`Serving PDF for material ${req.params.id}: ${material.file}`);

    // Try multiple path resolutions
    let fullPath;
    if (path.isAbsolute(material.file)) {
      fullPath = material.file;
    } else {
      // Try relative to current working directory
      fullPath = path.join(process.cwd(), material.file);

      // If that doesn't exist, try relative to server directory
      if (!fs.existsSync(fullPath)) {
        const serverDir = path.dirname(new URL(import.meta.url).pathname);
        fullPath = path.join(serverDir, '..', material.file);
      }

      // If that still doesn't exist, try uploads/materials directory specifically
      if (!fs.existsSync(fullPath)) {
        fullPath = path.join(process.cwd(), 'uploads', 'materials', path.basename(material.file));
      }
    }

    console.log(`Resolved path: ${fullPath}`);

    if (fs.existsSync(fullPath)) {
      console.log(`File exists, serving PDF: ${fullPath}`);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${material.fileName}"`);
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
    } else {
      console.log(`File does not exist: ${fullPath}`);
      // List files in uploads/materials directory for debugging
      const uploadsDir = path.join(process.cwd(), 'uploads', 'materials');
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        console.log(`Files in uploads/materials: ${files.join(', ')}`);
      } else {
        console.log(`uploads/materials directory does not exist: ${uploadsDir}`);
      }
      res.status(404).json({ message: 'PDF file not found on server' });
    }
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ message: 'Server error' });
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
    if (!req.body.title || !req.body.description || !req.body.category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const materialData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      createdBy: req.user._id
    };

    if (req.file) {
      materialData.file = req.file.path;
      materialData.fileName = req.file.originalname;
      materialData.fileSize = req.file.size;
      materialData.contentType = 'pdf';
    } else {
      materialData.content = req.body.content;
      materialData.contentType = 'text';
    }

    const material = await Material.create(materialData);
    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ message: error.message });
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
      // Delete file if it exists
      if (material.file) {
        const fullPath = path.isAbsolute(material.file)
          ? material.file
          : path.join(process.cwd(), material.file);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      await material.deleteOne();
      res.json({ message: 'Material removed' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export default router;