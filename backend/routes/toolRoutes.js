import express from 'express';
import Tool from '../models/Tool.js';
import SavedTool from '../models/SavedTool.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all tools (public: verified only)
router.get('/', async (req, res) => {
    try {
        const { search, category, pricing } = req.query;
        const query = { status: 'verified' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) query.category = category;
        if (pricing === 'free') query.isPaid = false;
        if (pricing === 'paid') query.isPaid = true;

        const tools = await Tool.find(query).sort({ featured: -1, likes: -1 });
        res.json(tools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single tool by ID (public: verified only)
router.get('/:id', async (req, res) => {
    try {
        const tool = await Tool.findOne({ id: req.params.id, status: 'verified' });
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.json(tool);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save a tool (protected)
router.post('/:id/save', auth, async (req, res) => {
    try {
        const existingSave = await SavedTool.findOne({
            userId: req.user._id,
            toolId: req.params.id
        });

        if (existingSave) {
            return res.status(400).json({ message: 'Tool already saved' });
        }

        const savedTool = new SavedTool({
            userId: req.user._id,
            toolId: req.params.id
        });

        await savedTool.save();
        res.status(201).json({ message: 'Tool saved successfully' });
    } catch (error) {
        console.error('Save tool error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Unsave a tool (protected)
router.delete('/:id/save', auth, async (req, res) => {
    try {
        const result = await SavedTool.findOneAndDelete({
            userId: req.user._id,
            toolId: req.params.id
        });

        if (!result) {
            return res.status(404).json({ message: 'Saved tool not found' });
        }

        res.json({ message: 'Tool unsaved successfully' });
    } catch (error) {
        console.error('Unsave tool error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Like a tool (protected)
router.post('/:id/like', auth, async (req, res) => {
    try {
        const tool = await Tool.findOne({ id: req.params.id });
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Check if user already liked
        const alreadyLiked = tool.likedBy.includes(req.user._id);

        if (alreadyLiked) {
            // Unlike
            tool.likedBy = tool.likedBy.filter(id => !id.equals(req.user._id));
            tool.likes = Math.max(0, tool.likes - 1);
        } else {
            // Like
            tool.likedBy.push(req.user._id);
            tool.likes += 1;
        }

        await tool.save();
        res.json({
            likes: tool.likes,
            isLiked: !alreadyLiked
        });
    } catch (error) {
        console.error('Like tool error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Check if user has saved/liked tools (protected)
router.post('/check-status', auth, async (req, res) => {
    try {
        const { toolIds } = req.body;

        if (!toolIds || !Array.isArray(toolIds)) {
            return res.status(400).json({ message: 'Tool IDs array required' });
        }

        // Check saved tools
        const savedTools = await SavedTool.find({
            userId: req.user._id,
            toolId: { $in: toolIds }
        });

        const savedToolIds = savedTools.map(st => st.toolId);

        // Check liked tools
        const tools = await Tool.find({ id: { $in: toolIds } });
        const likedToolIds = tools
            .filter(tool => tool.likedBy.includes(req.user._id))
            .map(tool => tool.id);

        res.json({
            saved: savedToolIds,
            liked: likedToolIds
        });
    } catch (error) {
        console.error('Check status error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
