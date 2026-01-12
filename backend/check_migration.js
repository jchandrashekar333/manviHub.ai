import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Tool from './models/Tool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function check() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI ? 'URI set' : 'URI NOT SET');
        await mongoose.connect(process.env.MONGODB_URI);
        const tool = await Tool.findOne();
        console.log('Tool Status Check:', tool ? { name: tool.name, status: tool.status } : 'No tools found');

        const countMissing = await Tool.countDocuments({ status: { $exists: false } });
        console.log('Tools missing status:', countMissing);

        if (countMissing > 0) {
            console.log(`Migrating ${countMissing} missing statuses to "verified"...`);
            await Tool.updateMany({ status: { $exists: false } }, { $set: { status: 'verified' } });
            console.log('Migration complete.');
        } else {
            console.log('No migration needed.');
        }
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
