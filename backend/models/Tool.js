import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    url: { type: String, required: true },
    image: { type: String },
    isPaid: { type: Boolean, required: true },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'verified' // Default to verified for now to match current behavior
    },
    featured: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        text: { type: String, required: true },
        username: { type: String, default: 'Anonymous' },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Tool = mongoose.model('Tool', toolSchema);

export default Tool;
