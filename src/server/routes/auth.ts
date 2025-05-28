import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { AuthService } from '../services/auth';

const router = express.Router();

console.log('🔐 Auth routes initialized');

// Login route
router.post('/login', async (req, res) => {
  console.log('🔑 Login attempt received:', { 
    email: req.body?.email, 
    hasPassword: !!req.body?.password 
  });
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    const authService = new AuthService(prisma);
    const result = await authService.login(email, password);

    res.json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Invalid credentials'
    });
  }
});

// Verify token route
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Register route (admin only)
router.post('/register', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can create users'
      });
    }

    const {
      name,
      email,
      password,
      mainDepartment,
      departments,
      isAdmin,
      isClient,
      clientProfile,
      company
    } = req.body;

    if (!name || !email || !password || !mainDepartment) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, password, and main department are required'
      });
    }

    const authService = new AuthService(prisma);
    const user = await authService.createUser({
      name,
      email,
      password,
      mainDepartment,
      departments: departments || [],
      isAdmin,
      isClient,
      clientProfile,
      company
    });

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Could not create user'
    });
  }
});

// Logout route (optional - just for consistency)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;