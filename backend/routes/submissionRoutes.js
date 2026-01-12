import express from 'express';
import PendingTool from '../models/PendingTool.js';
import Tool from '../models/Tool.js';
import auth from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

// Submit a new tool (protected - requires login)
router.post('/submit', auth, async (req, res) => {
    try {
        const { name, description, category, url, isPaid } = req.body;

        // Validation
        if (!name || !description || !category || !url) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if tool already exists in live database
        // Normalize URL for check (remove trailing slash)
        const normalizedUrl = url.toLowerCase().replace(/\/$/, '');

        // Use a regex to match URL with or without trailing slash
        const existingTool = await Tool.findOne({
            url: { $regex: new RegExp(`^${normalizedUrl}/?$`, 'i') }
        });

        if (existingTool) {
            return res.status(400).json({
                message: 'This tool is already listed in our directory.'
            });
        }

        // Check if tool is already pending
        const existingPending = await PendingTool.findOne({
            url: { $regex: new RegExp(`^${normalizedUrl}/?$`, 'i') },
            status: 'pending'
        });

        if (existingPending) {
            return res.status(400).json({
                message: 'This tool has already been submitted and is pending review.'
            });
        }

        // Create pending tool
        const pendingTool = new PendingTool({
            name,
            description,
            category,
            url,
            isPaid: isPaid || false,
            submittedBy: req.user._id,
            status: 'pending'
        });

        await pendingTool.save();

        res.status(201).json({
            message: 'Tool submitted successfully! It will be reviewed by our team.',
            tool: pendingTool
        });
    } catch (error) {
        console.error('Submit tool error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's submissions (protected)
router.get('/my-submissions', auth, async (req, res) => {
    try {
        const submissions = await PendingTool.find({ submittedBy: req.user._id })
            .sort({ submittedAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all pending tools (admin only)
router.get('/pending', auth, adminAuth, async (req, res) => {
    try {
        const pendingTools = await PendingTool.find({ status: 'pending' })
            .populate('submittedBy', 'name email')
            .sort({ submittedAt: -1 });

        res.json(pendingTools);
    } catch (error) {
        console.error('Get pending tools error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve a tool (admin only)
router.post('/approve/:id', auth, adminAuth, async (req, res) => {
    try {
        const pendingTool = await PendingTool.findById(req.params.id);

        if (!pendingTool) {
            return res.status(404).json({ message: 'Pending tool not found' });
        }

        if (pendingTool.status !== 'pending') {
            return res.status(400).json({ message: 'Tool already reviewed' });
        }

        // Get the highest ID from existing tools
        const lastTool = await Tool.findOne().sort({ id: -1 });
        const nextId = lastTool ? String(parseInt(lastTool.id) + 1) : '1';

        // Create new tool in main collection
        const newTool = new Tool({
            id: nextId,
            name: pendingTool.name,
            description: pendingTool.description,
            category: pendingTool.category,
            url: pendingTool.url,
            isPaid: pendingTool.isPaid,
            likes: 0,
            likedBy: []
        });

        await newTool.save();

        // Update pending tool status
        pendingTool.status = 'approved';
        pendingTool.reviewedAt = new Date();
        pendingTool.reviewedBy = req.user._id;
        await pendingTool.save();

        res.json({
            message: 'Tool approved and added to directory',
            tool: newTool
        });
    } catch (error) {
        console.error('Approve tool error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reject a tool (admin only)
router.post('/reject/:id', auth, adminAuth, async (req, res) => {
    try {
        const { reason } = req.body;
        const pendingTool = await PendingTool.findById(req.params.id);

        if (!pendingTool) {
            return res.status(404).json({ message: 'Pending tool not found' });
        }

        if (pendingTool.status !== 'pending') {
            return res.status(400).json({ message: 'Tool already reviewed' });
        }

        // Update pending tool status
        pendingTool.status = 'rejected';
        pendingTool.reviewedAt = new Date();
        pendingTool.reviewedBy = req.user._id;
        pendingTool.rejectionReason = reason || 'Does not meet quality standards';
        await pendingTool.save();

        res.json({
            message: 'Tool rejected',
            tool: pendingTool
        });
    } catch (error) {
        console.error('Reject tool error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
