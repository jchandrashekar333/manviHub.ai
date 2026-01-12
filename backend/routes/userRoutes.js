import express from 'express';
import SavedTool from '../models/SavedTool.js';
import Tool from '../models/Tool.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get user's saved tools
router.get('/me/saved-tools', auth, async (req, res) => {
    try {
        const savedTools = await SavedTool.find({ userId: req.user._id })
            .sort({ savedAt: -1 });

        // Get full tool details
        const toolIds = savedTools.map(st => st.toolId);
        const tools = await Tool.find({ id: { $in: toolIds } });

        // Create a map for quick lookup
        const toolMap = {};
        tools.forEach(tool => {
            toolMap[tool.id] = tool;
        });

        // Combine saved tool data with full tool details
        const result = savedTools.map(st => ({
            ...toolMap[st.toolId]?.toObject(),
            savedAt: st.savedAt
        })).filter(tool => tool.id); // Filter out any tools that weren't found

        res.json(result);
    } catch (error) {
        console.error('Get saved tools error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
