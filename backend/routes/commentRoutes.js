import express from 'express';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get comments for a tool
router.get('/:toolId', async (req, res) => {
    try {
        const comments = await Comment.find({ toolId: req.params.toolId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a comment
router.post('/', auth, async (req, res) => {
    try {
        const { toolId, content } = req.body;

        if (!toolId || !content) {
            return res.status(400).json({ message: 'Tool ID and content are required' });
        }

        const comment = new Comment({
            userId: req.user._id,
            toolId,
            content
        });

        await comment.save();

        // Populate user data before sending response
        await comment.populate('userId', 'name email');

        res.status(201).json(comment);
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
