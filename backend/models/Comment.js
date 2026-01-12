import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toolId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
