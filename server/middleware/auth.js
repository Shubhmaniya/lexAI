/**
 * Firebase Auth middleware
 * Verifies Firebase ID token from Authorization header
 * For development, allows a bypass with 'dev-user' userId
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Development bypass - allow requests without auth
    if (!authHeader || !process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID === 'your_project_id') {
      req.userId = req.headers['x-user-id'] || 'anonymous';
      return next();
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // In production, verify with Firebase Admin SDK
    try {
      const admin = require('firebase-admin');
      if (!admin.apps.length) {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID
        });
      }
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid;
      req.userEmail = decodedToken.email;
    } catch (firebaseErr) {
      // Fallback for development
      req.userId = 'anonymous';
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = authMiddleware;
