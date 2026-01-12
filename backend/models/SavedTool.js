import mongoose from 'mongoose';

const savedToolSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toolId: {
        type: String,
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Compound index to prevent duplicate saves
savedToolSchema.index({ userId: 1, toolId: 1 }, { unique: true });

const SavedTool = mongoose.model('SavedTool', savedToolSchema);

export default SavedTool;
