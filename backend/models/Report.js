import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    targetModel: {
        type: String,
        required: true,
        enum: ['Tool', 'Comment', 'User']
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetModel'
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resolutionNote: String,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: Date
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;
