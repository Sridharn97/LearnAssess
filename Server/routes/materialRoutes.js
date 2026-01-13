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

// Fallback multer for when Cloudinary fails
const fallbackStorage = multer.diskStorage({
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

const fallbackUpload = multer({
  storage: fallbackStorage,
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

// Create material (admin only) - with Cloudinary fallback
const createMaterialHandler = async (req, res) => {
  try {
    console.log('Creating new material...');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request user:', req.user);

    // Validate required fields
    if (!req.body.title || !req.body.description || !req.body.category) {
      return res.status(400).json({
        message: 'Missing required fields: title, description, and category are required'
      });
    }

    const materialData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      createdBy: req.user._id
    };

    if (req.file) {
      console.log('Processing file upload...');
      // Check if file was uploaded successfully to Cloudinary
      if (req.file.path && req.file.path.startsWith('http')) {
        // Cloudinary upload successful
        materialData.file = req.file.path; // Cloudinary URL
        materialData.publicId = req.file.filename; // Cloudinary Public ID
        materialData.fileName = req.file.originalname;
        materialData.fileSize = req.file.size;
        materialData.contentType = 'pdf';
        console.log('Cloudinary upload successful');
      } else {
        // Cloudinary failed, file saved locally as fallback
        console.log('Cloudinary upload failed, using local storage as fallback');
        materialData.file = req.file.path; // Local file path
        materialData.fileName = req.file.originalname;
        materialData.fileSize = req.file.size;
        materialData.contentType = 'pdf';
        console.log('Local storage fallback used');
      }
      console.log('Material data for PDF:', materialData);
    } else {
      console.log('Processing text content...');
      // Text content
      materialData.content = req.body.content;
      materialData.contentType = 'text';
      console.log('Material data for text:', materialData);
    }

    console.log('Saving material to database...');
    const material = await Material.create(materialData);
    console.log('Material created successfully:', material);
    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate entry error'
      });
    }

    // For multer/Cloudinary errors, return a more specific message
    if (error.message && (error.message.includes('cloudinary') || error.message.includes('multer'))) {
      return res.status(500).json({
        message: 'File upload failed. Please try creating a text material instead.',
        details: 'Upload service error'
      });
    }

    res.status(500).json({
      message: 'Internal server error while creating material',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
};

// Routes with fallback handling
router.post('/', protect, admin, (req, res, next) => {
  // Try Cloudinary upload first
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.log('Cloudinary upload failed, trying fallback:', err.message);
      // Try fallback upload
      fallbackUpload.single('file')(req, res, (fallbackErr) => {
        if (fallbackErr) {
          console.error('Both Cloudinary and fallback upload failed:', fallbackErr.message);
          return res.status(400).json({
            message: 'File upload failed. Please try creating a text material instead.',
            details: fallbackErr.message
          });
        }
        // Fallback upload successful, proceed with material creation
        createMaterialHandler(req, res);
      });
    } else {
      // Cloudinary upload successful, proceed with material creation
      createMaterialHandler(req, res);
    }
  });
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
        if (material.publicId) {
          // Try to delete from Cloudinary
          try {
            await cloudinary.uploader.destroy(material.publicId, { resource_type: 'raw' });
            console.log('Deleted from Cloudinary:', material.publicId);
          } catch (cloudinaryError) {
            console.warn('Failed to delete from Cloudinary:', cloudinaryError.message);
          }
        } else if (!material.file.startsWith('http')) {
          // Try to delete local file
          try {
            const fullPath = path.isAbsolute(material.file)
              ? material.file
              : path.join(process.cwd(), material.file);

            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
              console.log('Deleted local file:', fullPath);
            }
          } catch (fileError) {
            console.warn('Failed to delete local file:', fileError.message);
          }
        }
      }

      await material.deleteOne();
      res.json({ message: 'Material removed' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      message: 'Error deleting material',
      details: error.message
    });
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

    // Handle local files (fallback storage)
    console.log('Checking for local file:', material.file);
    const fullPath = path.isAbsolute(material.file)
      ? material.file
      : path.join(process.cwd(), material.file);

    console.log('Full file path:', fullPath);

    if (fs.existsSync(fullPath)) {
      console.log('Serving local PDF file');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${material.fileName || 'document.pdf'}"`);
      const fileStream = fs.createReadStream(fullPath);
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