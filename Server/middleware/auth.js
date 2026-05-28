import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware - verifies JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ 
        message: 'Forbidden: Insufficient permissions',
        requiredRole: allowedRoles,
        userRole: req.user.role
      });
    }
  };
};

// Admin only authorization
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      message: 'Forbidden: Admin access required' 
    });
  }
};

// User only authorization
export const userOnly = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({ 
      message: 'Forbidden: User access required' 
    });
  }
};

// Check if user owns the resource
export const checkOwnership = async (req, res, next) => {
  try {
    // This can be customized based on your resource model
    // Example: check if req.user._id matches resource ownerId
    if (req.params.userId && req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Forbidden: You can only access your own resources' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: Check multiple permissions
export const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const rolePermissions = {
      admin: ['create', 'read', 'update', 'delete'],
      user: ['read', 'create']
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    const hasPermission = requiredPermissions.every(perm => 
      userPermissions.includes(perm)
    );

    if (hasPermission) {
      next();
    } else {
      return res.status(403).json({ 
        message: 'Forbidden: Insufficient permissions',
        requiredPermissions,
        userPermissions
      });
    }
  };
};