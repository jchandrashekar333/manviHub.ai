import express from 'express';
import auth from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';
import {
    getDashboardStats,
    getUsers,
    updateUserRole,
    banUser,
    getReports,
    resolveReport,
    updateToolStatus,
    deleteTool,
    getTools
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth and adminAuth to all routes
router.use(auth, adminAuth);

router.get('/stats', getDashboardStats);
router.get('/tools', getTools); // New route
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/ban', banUser);

// Moderation
router.get('/reports', getReports);
router.post('/reports/:id/resolve', resolveReport);

// Tools Management (Admin specific overrides)
router.put('/tools/:id/status', updateToolStatus);
router.delete('/tools/:id', deleteTool);

export default router;
