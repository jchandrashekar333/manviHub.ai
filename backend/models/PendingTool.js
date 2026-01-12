import mongoose from 'mongoose';

const pendingToolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectionReason: {
        type: String
    }
}, { timestamps: true });

const PendingTool = mongoose.model('PendingTool', pendingToolSchema);

export default PendingTool;
