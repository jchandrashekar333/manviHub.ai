import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String // name of lucide icon or url
    },
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
