import User from '../models/User.js';
import Tool from '../models/Tool.js';
import PendingTool from '../models/PendingTool.js';
import Report from '../models/Report.js';
import Comment from '../models/Comment.js';

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalTools,
            pendingTools,
            totalComments,
            pendingReports
        ] = await Promise.all([
            User.countDocuments(),
            Tool.countDocuments(),
            PendingTool.countDocuments({ status: 'pending' }),
            Comment.countDocuments(),
            Report.countDocuments({ status: 'pending' })
        ]);

        res.json({
            users: totalUsers,
            tools: totalTools,
            pendingTools,
            comments: totalComments,
            reports: pendingReports
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        const query = {};

        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'moderator', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        res.json({ message: 'Role updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent banning other admins
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot ban an admin' });
        }

        user.isBanned = !user.isBanned;
        await user.save();

        res.json({ message: user.isBanned ? 'User banned' : 'User activated', isBanned: user.isBanned });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTools = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tools = await Tool.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Tool.countDocuments(query);

        res.json({
            tools,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getReports = async (req, res) => {
    try {
        const reports = await Report.find({ status: 'pending' })
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const resolveReport = async (req, res) => {
    try {
        const { status, resolutionNote } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            {
                status,
                resolutionNote,
                resolvedBy: req.user._id,
                resolvedAt: new Date()
            },
            { new: true }
        );
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateToolStatus = async (req, res) => {
    try {
        const { status, featured, pricing } = req.body;
        const update = {};

        if (status && ['pending', 'verified', 'rejected'].includes(status)) update.status = status;
        if (typeof featured !== 'undefined') update.featured = featured;
        if (typeof pricing !== 'undefined') update.isPaid = pricing; // Frontend sends boolean or string? let's assume boolean 'isPaid' is mapped from 'pricing'

        const tool = await Tool.findOneAndUpdate(
            { id: req.params.id }, // Use custom ID filter
            update,
            { new: true }
        );

        if (!tool) return res.status(404).json({ message: 'Tool not found' });

        res.json(tool);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTool = async (req, res) => {
    try {
        const result = await Tool.deleteOne({ id: req.params.id }); // Using custom ID
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.json({ message: 'Tool deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
