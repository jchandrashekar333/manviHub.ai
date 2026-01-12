import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from './models/Tool.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const categories = await Tool.distinct('category');
        console.log('Categories in DB:', categories);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
